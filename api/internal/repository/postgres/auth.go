package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"pawplan/api/internal/domain"
)

type Users struct{ DB *pgxpool.Pool }
type Sessions struct{ DB *pgxpool.Pool }

const userColumns = `id, email, password, name, COALESCE(phone, ''), "createdAt", COALESCE(image,''), COALESCE("lineUserId",'')`

func scanUser(row pgx.Row) (domain.User, error) {
	var user domain.User
	err := row.Scan(&user.ID, &user.Email, &user.PasswordHash, &user.Name, &user.Phone, &user.CreatedAt, &user.Image, &user.LineUserID)
	if errors.Is(err, pgx.ErrNoRows) {
		return user, domain.ErrNotFound
	}
	var dbErr *pgconn.PgError
	if errors.As(err, &dbErr) && dbErr.Code == "23505" {
		return user, domain.ErrEmailTaken
	}
	return user, err
}

func (r Users) Create(ctx context.Context, user domain.User) (domain.User, error) {
	return scanUser(r.DB.QueryRow(ctx, `INSERT INTO "User" (email, password, name, phone) VALUES ($1,$2,$3,NULLIF($4,'')) RETURNING `+userColumns, user.Email, user.PasswordHash, user.Name, user.Phone))
}

func (r Users) ByEmail(ctx context.Context, email string) (domain.User, error) {
	return scanUser(r.DB.QueryRow(ctx, `SELECT `+userColumns+` FROM "User" WHERE lower(email) = $1`, email))
}

func (r Users) ByID(ctx context.Context, id int) (domain.User, error) {
	return scanUser(r.DB.QueryRow(ctx, `SELECT `+userColumns+` FROM "User" WHERE id = $1`, id))
}

func (r Sessions) Save(ctx context.Context, session domain.Session) error {
	_, err := r.DB.Exec(ctx, `INSERT INTO "GoSession" ("tokenHash", "userId", "expiresAt") VALUES ($1,$2,$3)`, session.TokenHash, session.UserID, session.ExpiresAt)
	return err
}

func (r Sessions) Find(ctx context.Context, hash string) (domain.Session, error) {
	var session domain.Session
	err := r.DB.QueryRow(ctx, `SELECT "tokenHash", "userId", "expiresAt" FROM "GoSession" WHERE "tokenHash" = $1`, hash).Scan(&session.TokenHash, &session.UserID, &session.ExpiresAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return session, domain.ErrNotFound
	}
	return session, err
}

func (r Sessions) Delete(ctx context.Context, hash string) error {
	_, err := r.DB.Exec(ctx, `DELETE FROM "GoSession" WHERE "tokenHash" = $1`, hash)
	return err
}
