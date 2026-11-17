package usecase

import (
	"context"
	"errors"
	"testing"
	"time"

	"pawplan/api/internal/domain"
)

type memoryAppointments struct{ items map[int]domain.Appointment }

func (r *memoryAppointments) Create(_ context.Context, item domain.Appointment) (domain.Appointment, error) {
	item.ID = len(r.items) + 1
	r.items[item.ID] = item
	return item, nil
}
func (r *memoryAppointments) ListOwned(_ context.Context, userID int) ([]domain.Appointment, error) {
	items := make([]domain.Appointment, 0)
	for _, item := range r.items {
		if item.UserID == userID {
			items = append(items, item)
		}
	}
	return items, nil
}
func (r *memoryAppointments) UpdateOwned(_ context.Context, userID, id int, change func(*domain.Appointment) error) (domain.Appointment, error) {
	item, ok := r.items[id]
	if !ok || item.UserID != userID {
		return domain.Appointment{}, domain.ErrNotFound
	}
	if err := change(&item); err != nil {
		return domain.Appointment{}, err
	}
	r.items[id] = item
	return item, nil
}
func ptr(value string) *string { return &value }
func TestAppointmentOwnershipAndTransitions(t *testing.T) {
	repo := &memoryAppointments{items: map[int]domain.Appointment{}}
	a := NewAppointments(repo)
	a.now = func() time.Time { return time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC) }
	ctx := context.Background()
	input := BookingInput{Owner: "Owner", Phone: "0812345678", PetName: "Milo", PetType: "Cat", Service: "Checkup", Date: "2026-01-02", Time: "09:00"}
	if _, err := a.Book(ctx, 0, input); !errors.Is(err, domain.ErrUnauthorized) {
		t.Fatal("anonymous booking accepted")
	}
	item, err := a.Book(ctx, 1, input)
	if err != nil {
		t.Fatal(err)
	}
	if items, err := a.List(ctx, 2); err != nil || len(items) != 0 {
		t.Fatal("appointments exposed to another user")
	}
	if _, err := a.Update(ctx, 2, item.ID, AppointmentChange{Status: ptr("cancelled")}); !errors.Is(err, domain.ErrNotFound) {
		t.Fatal("another user modified appointment")
	}
	for _, status := range []string{"confirmed", "completed", "arrived", "unknown"} {
		if _, err := a.Update(ctx, 1, item.ID, AppointmentChange{Status: ptr(status)}); err == nil {
			t.Fatalf("owner accepted privileged status %s", status)
		}
	}
	item, err = a.Update(ctx, 1, item.ID, AppointmentChange{Date: ptr("2026-01-03"), Time: ptr("10:00")})
	if err != nil || item.Date != "2026-01-03" || item.Status != "pending" {
		t.Fatalf("reschedule: %+v %v", item, err)
	}
	item, err = a.Update(ctx, 1, item.ID, AppointmentChange{Notes: ptr("")})
	if err != nil || item.Notes != "" {
		t.Fatal("cannot clear notes")
	}
	item, err = a.Update(ctx, 1, item.ID, AppointmentChange{Status: ptr("cancelled")})
	if err != nil || item.Status != "cancelled" {
		t.Fatal("cannot cancel")
	}
	if _, err := a.Update(ctx, 1, item.ID, AppointmentChange{Date: ptr("2026-01-04")}); err == nil {
		t.Fatal("cancelled appointment can be changed")
	}
}
func TestBookingValidatesClinicLocalDateAndTime(t *testing.T) {
	a := NewAppointments(&memoryAppointments{items: map[int]domain.Appointment{}})
	// 08:15 in Bangkok; 08:00 is past even though UTC still reads 01:15.
	a.now = func() time.Time { return time.Date(2026, 1, 2, 1, 15, 0, 0, time.UTC) }
	for _, tc := range []struct {
		date, slot string
		valid      bool
	}{
		{"2026-01-02", "09:00", true}, {"2026-01-01", "09:00", false}, {"2026-02-30", "09:00", false}, {"2026-01-02", "12:00", false}, {"2026-01-02", "9:00", false}, {"2026-01-02", "16:30", false},
	} {
		if err := a.validateSchedule(tc.date, tc.slot); (err == nil) != tc.valid {
			t.Errorf("%s %s: %v", tc.date, tc.slot, err)
		}
	}
}
