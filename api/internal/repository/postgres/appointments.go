package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"pawplan/api/internal/domain"
)

type Appointments struct{ DB *pgxpool.Pool }

const appointmentColumns = `id, COALESCE("userId",0), patient, COALESCE(owner,''), phone, "petName", "petType", service, date, time, status, COALESCE(notes,''), COALESCE("doctorName",''), "createdAt", "updatedAt"`

func scanAppointment(row pgx.Row) (domain.Appointment, error) {
	var item domain.Appointment
	err := row.Scan(&item.ID, &item.UserID, &item.Patient, &item.Owner, &item.Phone, &item.PetName, &item.PetType, &item.Service, &item.Date, &item.Time, &item.Status, &item.Notes, &item.DoctorName, &item.CreatedAt, &item.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return item, domain.ErrNotFound
	}
	return item, err
}

func (r Appointments) Create(ctx context.Context, item domain.Appointment) (domain.Appointment, error) {
	return scanAppointment(r.DB.QueryRow(ctx, `INSERT INTO "Appointment" ("userId",patient,owner,phone,"petName","petType",service,date,time,status,notes,"updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now()) RETURNING `+appointmentColumns, item.UserID, item.Patient, item.Owner, item.Phone, item.PetName, item.PetType, item.Service, item.Date, item.Time, item.Status, item.Notes))
}

func (r Appointments) ListOwned(ctx context.Context, userID int) ([]domain.Appointment, error) {
	rows, err := r.DB.Query(ctx, `SELECT `+appointmentColumns+` FROM "Appointment" WHERE "userId"=$1 ORDER BY "createdAt" DESC, id DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]domain.Appointment, 0)
	for rows.Next() {
		item, err := scanAppointment(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r Appointments) UpdateOwned(ctx context.Context, userID, id int, change func(*domain.Appointment) error) (domain.Appointment, error) {
	tx, err := r.DB.Begin(ctx)
	if err != nil {
		return domain.Appointment{}, err
	}
	defer tx.Rollback(context.Background())
	item, err := scanAppointment(tx.QueryRow(ctx, `SELECT `+appointmentColumns+` FROM "Appointment" WHERE id=$1 AND "userId"=$2 FOR UPDATE`, id, userID))
	if err != nil {
		return domain.Appointment{}, err
	}
	if err := change(&item); err != nil {
		return domain.Appointment{}, err
	}
	item, err = scanAppointment(tx.QueryRow(ctx, `UPDATE "Appointment" SET "petName"=$3,"petType"=$4,service=$5,date=$6,time=$7,status=$8,notes=$9,"updatedAt"=now() WHERE id=$1 AND "userId"=$2 RETURNING `+appointmentColumns, id, userID, item.PetName, item.PetType, item.Service, item.Date, item.Time, item.Status, item.Notes))
	if err != nil {
		return domain.Appointment{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.Appointment{}, err
	}
	return item, nil
}
