// Package usecase contains application rules, independent of Fiber and PostgreSQL.
package usecase

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"net/mail"
	"strings"
	"time"
	"unicode/utf8"

	"pawplan/api/internal/domain"
)

type UserRepository interface {
	Create(context.Context, domain.User) (domain.User, error)
	ByEmail(context.Context, string) (domain.User, error)
	ByID(context.Context, int) (domain.User, error)
}

type SessionRepository interface {
	Save(context.Context, domain.Session) error
	Find(context.Context, string) (domain.Session, error)
	Delete(context.Context, string) error
}

type PasswordHasher interface {
	Hash(string) (string, error)
	Matches(string, string) bool
}

const SessionTTL = 7 * 24 * time.Hour

type Auth struct {
	users     UserRepository
	sessions  SessionRepository
	passwords PasswordHasher
	now       func() time.Time
}

func NewAuth(users UserRepository, sessions SessionRepository, passwords PasswordHasher) *Auth {
	return &Auth{users: users, sessions: sessions, passwords: passwords, now: time.Now}
}

type RegisterInput struct{ Email, Password, Name, Phone string }

func (a *Auth) Register(ctx context.Context, input RegisterInput) (domain.User, error) {
	email := strings.ToLower(strings.TrimSpace(input.Email))
	parsed, err := mail.ParseAddress(email)
	if err != nil || parsed.Address != email || len(email) > 254 {
		return domain.User{}, domain.ValidationError{Message: "A valid email is required"}
	}
	// bcrypt accepts at most 72 bytes, which matters for multibyte passwords.
	if utf8.RuneCountInString(input.Password) < 8 || len(input.Password) > 72 {
		return domain.User{}, domain.ValidationError{Message: "Password must be at least 8 characters and at most 72 bytes"}
	}
	name, phone := strings.TrimSpace(input.Name), strings.TrimSpace(input.Phone)
	if name == "" || utf8.RuneCountInString(name) > 100 || len(phone) > 30 {
		return domain.User{}, domain.ValidationError{Message: "Name is required (maximum 100 characters); phone must be at most 30 bytes"}
	}
	hash, err := a.passwords.Hash(input.Password)
	if err != nil {
		return domain.User{}, err
	}
	return a.users.Create(ctx, domain.User{Email: email, PasswordHash: hash, Name: name, Phone: phone})
}

func (a *Auth) Login(ctx context.Context, email, password string) (domain.User, string, error) {
	// bcryptjs accepted passwords longer than 72 bytes in the legacy API.
	// Keep that verification behavior for existing accounts; only registration
	// enforces bcrypt's 72-byte limit. Bound login input by the HTTP body limit.
	if len(password) == 0 || len(password) > 16*1024 || len(email) > 254 {
		return domain.User{}, "", domain.ErrUnauthorized
	}
	user, err := a.users.ByEmail(ctx, strings.ToLower(strings.TrimSpace(email)))
	if errors.Is(err, domain.ErrNotFound) {
		// Perform a bcrypt comparison even when the email does not exist.
		a.passwords.Matches(dummyPasswordHash, password)
		return domain.User{}, "", domain.ErrUnauthorized
	}
	if err != nil {
		return domain.User{}, "", err
	}
	if !a.passwords.Matches(user.PasswordHash, password) {
		return domain.User{}, "", domain.ErrUnauthorized
	}
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return domain.User{}, "", err
	}
	token := base64.RawURLEncoding.EncodeToString(bytes)
	err = a.sessions.Save(ctx, domain.Session{TokenHash: hashToken(token), UserID: user.ID, ExpiresAt: a.now().Add(SessionTTL)})
	if err != nil {
		return domain.User{}, "", err
	}
	return user, token, nil
}

// A fixed cost-12 bcrypt hash used only to avoid a fast unknown-email path.
const dummyPasswordHash = "$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW"

func (a *Auth) Me(ctx context.Context, token string) (domain.User, error) {
	if !validToken(token) {
		return domain.User{}, domain.ErrUnauthorized
	}
	session, err := a.sessions.Find(ctx, hashToken(token))
	if errors.Is(err, domain.ErrNotFound) {
		return domain.User{}, domain.ErrUnauthorized
	}
	if err != nil {
		return domain.User{}, err
	}
	if !a.now().Before(session.ExpiresAt) {
		return domain.User{}, domain.ErrUnauthorized
	}
	user, err := a.users.ByID(ctx, session.UserID)
	if errors.Is(err, domain.ErrNotFound) {
		return domain.User{}, domain.ErrUnauthorized
	}
	return user, err
}

func (a *Auth) Logout(ctx context.Context, token string) error {
	if !validToken(token) {
		return nil
	}
	return a.sessions.Delete(ctx, hashToken(token))
}

func validToken(token string) bool {
	decoded, err := base64.RawURLEncoding.DecodeString(token)
	return err == nil && len(decoded) == 32 && len(token) == 43
}

func hashToken(token string) string {
	hash := sha256.Sum256([]byte(token))
	return hex.EncodeToString(hash[:])
}
