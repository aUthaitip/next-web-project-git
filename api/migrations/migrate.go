package migrations

import (
	"context"
	_ "embed"
	"errors"
	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed 001_auth.sql
var authSQL string

//go:embed 002_appointments.sql
var appointmentsSQL string

const LatestVersion = "002_appointments"

var ErrSchemaUnavailable = errors.New("database schema does not exist or is not accessible; create it and grant access before migrating")

func Apply(ctx context.Context, db *pgxpool.Pool) error {
	tx, err := db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)
	var schema *string
	if err := tx.QueryRow(ctx, `SELECT current_schema()`).Scan(&schema); err != nil {
		return err
	}
	if schema == nil {
		return ErrSchemaUnavailable
	}
	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(71034001)`); err != nil {
		return err
	}
	if _, err := tx.Exec(ctx, `CREATE TABLE IF NOT EXISTS "GoMigration" (version TEXT PRIMARY KEY, "appliedAt" TIMESTAMPTZ NOT NULL DEFAULT now())`); err != nil {
		return err
	}
	for _, migration := range []struct{ version, sql string }{{"001_auth", authSQL}, {LatestVersion, appointmentsSQL}} {
		var applied bool
		if err := tx.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM "GoMigration" WHERE version = $1)`, migration.version).Scan(&applied); err != nil {
			return err
		}
		if applied {
			continue
		}
		if _, err := tx.Exec(ctx, migration.sql); err != nil {
			return err
		}
		if _, err := tx.Exec(ctx, `INSERT INTO "GoMigration" (version) VALUES ($1)`, migration.version); err != nil {
			return err
		}
	}
	return tx.Commit(ctx)
}
