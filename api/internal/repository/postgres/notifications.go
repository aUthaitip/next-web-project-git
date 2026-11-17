package postgres

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"pawplan/api/internal/domain"
)

type Notifications struct{ DB *pgxpool.Pool }

func (r Notifications) ListOwned(ctx context.Context, userID int) ([]domain.Notification, error) {
	rows, err := r.DB.Query(ctx, `SELECT id,message,read,"createdAt" FROM "Notification" WHERE "userId"=$1 ORDER BY "createdAt" DESC,id DESC LIMIT 20`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]domain.Notification, 0)
	for rows.Next() {
		var item domain.Notification
		if err := rows.Scan(&item.ID, &item.Message, &item.Read, &item.CreatedAt); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}
func (r Notifications) MarkRead(ctx context.Context, userID, id int, all bool) error {
	_, err := r.DB.Exec(ctx, `UPDATE "Notification" SET read=true WHERE "userId"=$1 AND ($2 OR id=$3)`, userID, all, id)
	return err
}
