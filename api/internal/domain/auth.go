package domain

import (
	"errors"
	"time"
)

var (
	ErrNotFound     = errors.New("not found")
	ErrEmailTaken   = errors.New("email already registered")
	ErrUnauthorized = errors.New("unauthorized")
)

type ValidationError struct{ Message string }

func (e ValidationError) Error() string { return e.Message }

type User struct {
	ID           int
	Email        string
	PasswordHash string
	Name         string
	Phone        string
	Image        string
	LineUserID   string
	CreatedAt    time.Time
}

type Session struct {
	TokenHash string
	UserID    int
	ExpiresAt time.Time
}
