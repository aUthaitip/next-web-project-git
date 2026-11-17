package postgres

import (
	"context"
	"pawplan/api/internal/domain"
)

func (r Users) UpdateProfile(ctx context.Context, u domain.User, oldHash, currentSessionHash string) (domain.User, error) {
	tx, err := r.DB.Begin(ctx)
	if err != nil {
		return domain.User{}, err
	}
	defer tx.Rollback(context.Background())
	updated, err := scanUser(tx.QueryRow(ctx, `UPDATE "User" SET name=$2,email=$3,phone=NULLIF($4,''),image=NULLIF($5,''),password=$6 WHERE id=$1 AND password=$7 RETURNING `+userColumns, u.ID, u.Name, u.Email, u.Phone, u.Image, u.PasswordHash, oldHash))
	if err != nil {
		return domain.User{}, err
	}
	if u.PasswordHash != oldHash {
		if _, err := tx.Exec(ctx, `DELETE FROM "GoSession" WHERE "userId"=$1 AND "tokenHash"<>$2`, u.ID, currentSessionHash); err != nil {
			return domain.User{}, err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.User{}, err
	}
	return updated, nil
}
