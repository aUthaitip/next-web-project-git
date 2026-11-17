package main

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"pawplan/api/internal/config"
	"pawplan/api/migrations"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	db, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("Cannot initialize database connection")
		os.Exit(1)
	}
	defer db.Close()
	if err := migrations.Apply(ctx, db); err != nil {
		if errors.Is(err, migrations.ErrSchemaUnavailable) {
			slog.Error(err.Error())
		} else {
			slog.Error("Migration failed; check connectivity, permissions and duplicate email addresses")
		}
		os.Exit(1)
	}
	slog.Info("Auth migration applied")
}
