package usecase

import (
	"context"
	"pawplan/api/internal/domain"
)

type NotificationRepository interface {
	ListOwned(context.Context, int) ([]domain.Notification, error)
	MarkRead(context.Context, int, int, bool) error
}

type Notifications struct{ repo NotificationRepository }

func NewNotifications(repo NotificationRepository) *Notifications { return &Notifications{repo: repo} }
func (n *Notifications) List(ctx context.Context, userID int) ([]domain.Notification, error) {
	if userID <= 0 {
		return nil, domain.ErrUnauthorized
	}
	return n.repo.ListOwned(ctx, userID)
}
func (n *Notifications) Read(ctx context.Context, userID, id int, all bool) error {
	if userID <= 0 {
		return domain.ErrUnauthorized
	}
	if !all && id <= 0 {
		return domain.ValidationError{Message: "Specify a notification ID or all=true"}
	}
	return n.repo.MarkRead(ctx, userID, id, all)
}
