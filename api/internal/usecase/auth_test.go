package usecase

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"pawplan/api/internal/domain"
)

type memoryUsers struct {
	user    domain.User
	failure error
}

func (r *memoryUsers) Create(_ context.Context, u domain.User) (domain.User, error) {
	if r.user.Email == u.Email {
		return domain.User{}, domain.ErrEmailTaken
	}
	u.ID = 1
	r.user = u
	return u, r.failure
}
func (r *memoryUsers) ByEmail(_ context.Context, email string) (domain.User, error) {
	if r.failure != nil {
		return domain.User{}, r.failure
	}
	if r.user.Email != email {
		return domain.User{}, domain.ErrNotFound
	}
	return r.user, nil
}
func (r *memoryUsers) ByID(_ context.Context, id int) (domain.User, error) {
	if r.user.ID != id {
		return domain.User{}, domain.ErrNotFound
	}
	return r.user, r.failure
}

type memorySessions struct {
	values  map[string]domain.Session
	failure error
}

func (r *memorySessions) Save(_ context.Context, s domain.Session) error {
	if r.failure != nil {
		return r.failure
	}
	r.values[s.TokenHash] = s
	return nil
}
func (r *memorySessions) Find(_ context.Context, h string) (domain.Session, error) {
	s, ok := r.values[h]
	if !ok {
		return s, domain.ErrNotFound
	}
	return s, nil
}
func (r *memorySessions) Delete(_ context.Context, h string) error { delete(r.values, h); return nil }

type fakeHasher struct{}

func (fakeHasher) Hash(p string) (string, error) { return "hashed:" + p, nil }
func (fakeHasher) Matches(h, p string) bool      { return h == "hashed:"+p }

func setup() (*Auth, *memoryUsers, *memorySessions) {
	u := &memoryUsers{}
	s := &memorySessions{values: make(map[string]domain.Session)}
	return NewAuth(u, s, fakeHasher{}), u, s
}

func TestRegisterValidationAndNormalization(t *testing.T) {
	a, u, _ := setup()
	ctx := context.Background()
	input := RegisterInput{Email: " Owner@Example.test ", Password: "password123", Name: " Owner ", Phone: " 123 "}
	got, err := a.Register(ctx, input)
	if err != nil || got.Email != "owner@example.test" || got.Name != "Owner" || got.Phone != "123" || u.user.PasswordHash == input.Password {
		t.Fatalf("registration result: %+v, %v", got, err)
	}
	if _, err = a.Register(ctx, input); !errors.Is(err, domain.ErrEmailTaken) {
		t.Fatalf("expected duplicate: %v", err)
	}
	for _, input := range []RegisterInput{
		{Email: "not-email", Password: "password123", Name: "Owner"},
		{Email: "Owner <owner@example.test>", Password: "password123", Name: "Owner"},
		{Email: "x@example.test", Password: "short", Name: "Owner"},
		{Email: "x@example.test", Password: strings.Repeat("ก", 25), Name: "Owner"},
		{Email: "x@example.test", Password: "password123", Name: " "},
	} {
		var validation domain.ValidationError
		if _, err := a.Register(ctx, input); !errors.As(err, &validation) {
			t.Errorf("expected validation error: %v", err)
		}
	}
}

func TestSessionLifecycle(t *testing.T) {
	a, _, sessions := setup()
	ctx := context.Background()
	_, err := a.Register(ctx, RegisterInput{Email: "owner@example.test", Password: "password123", Name: "Owner"})
	if err != nil {
		t.Fatal(err)
	}
	for _, email := range []string{"owner@example.test", "missing@example.test"} {
		if _, _, err := a.Login(ctx, email, "incorrect"); !errors.Is(err, domain.ErrUnauthorized) {
			t.Fatal("invalid login accepted")
		}
	}
	user, token, err := a.Login(ctx, " OWNER@example.test ", "password123")
	if err != nil || !validToken(token) {
		t.Fatalf("login failed: %v", err)
	}
	if _, storedRaw := sessions.values[token]; storedRaw {
		t.Fatal("raw token stored")
	}
	if len(sessions.values) != 1 {
		t.Fatal("missing session")
	}
	if got, err := a.Me(ctx, token); err != nil || got.ID != user.ID {
		t.Fatalf("me failed: %v", err)
	}
	if _, err := a.Me(ctx, token+"tampered"); !errors.Is(err, domain.ErrUnauthorized) {
		t.Fatal("tampered token accepted")
	}
	if err := a.Logout(ctx, token); err != nil {
		t.Fatal(err)
	}
	if _, err := a.Me(ctx, token); !errors.Is(err, domain.ErrUnauthorized) {
		t.Fatal("revoked token accepted")
	}
	if err := a.Logout(ctx, token); err != nil {
		t.Fatal("logout must be idempotent")
	}
	_, token, err = a.Login(ctx, "owner@example.test", "password123")
	if err != nil {
		t.Fatal(err)
	}
	a.now = func() time.Time { return time.Now().Add(SessionTTL + time.Minute) }
	if _, err := a.Me(ctx, token); !errors.Is(err, domain.ErrUnauthorized) {
		t.Fatal("expired token accepted")
	}
}

func TestLoginDoesNotIssueTokenOnStorageFailure(t *testing.T) {
	a, _, sessions := setup()
	ctx := context.Background()
	_, err := a.Register(ctx, RegisterInput{Email: "owner@example.test", Password: "password123", Name: "Owner"})
	if err != nil {
		t.Fatal(err)
	}
	sessions.failure = errors.New("database down")
	_, token, err := a.Login(ctx, "owner@example.test", "password123")
	if err == nil || token != "" {
		t.Fatal("token issued without a stored session")
	}
}

func TestLegacyLongPasswordCanLoginButCannotRegister(t *testing.T) {
	a, users, _ := setup()
	password := strings.Repeat("ก", 25) // 75 bytes, valid in the legacy bcryptjs API.
	users.user = domain.User{ID: 1, Email: "legacy@example.test", PasswordHash: "hashed:" + password}
	_, token, err := a.Login(context.Background(), "legacy@example.test", password)
	if err != nil || !validToken(token) {
		t.Fatalf("legacy login rejected: %v", err)
	}
	var validation domain.ValidationError
	_, err = a.Register(context.Background(), RegisterInput{Email: "new@example.test", Name: "New", Password: password})
	if !errors.As(err, &validation) {
		t.Fatal("new registration must still enforce the bcrypt byte limit")
	}
	_, _, err = a.Login(context.Background(), "legacy@example.test", strings.Repeat("x", 16*1024+1))
	if !errors.Is(err, domain.ErrUnauthorized) {
		t.Fatal("oversized login accepted")
	}
}
