package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"pawplan/api/internal/config"
	"pawplan/api/internal/repository/postgres"
	"pawplan/api/internal/security"
	transport "pawplan/api/internal/transport/http"
	"pawplan/api/internal/usecase"
	"pawplan/api/migrations"
)

func main() {
	if err := run(); err != nil {
		slog.Error("API stopped; check database availability and configuration", "errorType", errType(err))
		os.Exit(1)
	}
}

func errType(err error) string { return fmt.Sprintf("%T", err) }

func run() error {
	cfg, err := config.Load()
	if err != nil {
		slog.Error(err.Error())
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	poolConfig, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		return err
	}
	poolConfig.MaxConns = 10
	poolConfig.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeExec
	db, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return err
	}
	defer db.Close()
	if err := db.Ping(ctx); err != nil {
		return err
	}
	auth := usecase.NewAuth(postgres.Users{DB: db}, postgres.Sessions{DB: db}, security.Bcrypt{})
	ready := func(ctx context.Context) error {
		var applied bool
		err := db.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM "GoMigration" WHERE version = $1)`, migrations.LatestVersion).Scan(&applied)
		if err != nil {
			return err
		}
		if !applied {
			return errors.New("auth migration not applied")
		}
		return nil
	}
	app := transport.New(auth, ready, transport.Options{FrontendOrigin: cfg.FrontendOrigin, SecureCookies: cfg.SecureCookies, CookieSameSite: cfg.CookieSameSite, TrustedProxies: cfg.TrustedProxies})
	transport.RegisterMemberRoutes(app, auth, usecase.NewAppointments(postgres.Appointments{DB: db}), usecase.NewProfile(postgres.Users{DB: db}, security.Bcrypt{}), usecase.NewNotifications(postgres.Notifications{DB: db}))
	signals, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-signals.Done()
		shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		_ = app.ShutdownWithContext(shutdown)
	}()
	slog.Info("Starting PawPlan API", "address", cfg.ListenAddress)
	return app.Listen(cfg.ListenAddress)
}
