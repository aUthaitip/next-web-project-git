package usecase

import (
	"context"
	"strings"
	"time"
	"unicode/utf8"

	"pawplan/api/internal/domain"
)

// UpdateOwned runs the change while holding the appointment's row lock. The
// repository enforces ownership before the callback can inspect or mutate it.
type AppointmentRepository interface {
	Create(context.Context, domain.Appointment) (domain.Appointment, error)
	ListOwned(context.Context, int) ([]domain.Appointment, error)
	UpdateOwned(context.Context, int, int, func(*domain.Appointment) error) (domain.Appointment, error)
}

type Appointments struct {
	repo AppointmentRepository
	now  func() time.Time
}

func NewAppointments(repo AppointmentRepository) *Appointments {
	return &Appointments{repo: repo, now: time.Now}
}

type BookingInput struct{ Owner, Phone, PetName, PetType, Service, Date, Time, Notes string }
type AppointmentChange struct{ Status, Date, Time, PetName, PetType, Service, Notes *string }

func (a *Appointments) Book(ctx context.Context, userID int, in BookingInput) (domain.Appointment, error) {
	if userID <= 0 {
		return domain.Appointment{}, domain.ErrUnauthorized
	}
	item := domain.Appointment{UserID: userID, Owner: strings.TrimSpace(in.Owner), Phone: strings.TrimSpace(in.Phone), PetName: strings.TrimSpace(in.PetName), PetType: strings.TrimSpace(in.PetType), Service: strings.TrimSpace(in.Service), Date: in.Date, Time: in.Time, Notes: strings.TrimSpace(in.Notes), Status: "pending"}
	item.Patient = item.Owner
	if err := validateAppointment(item); err != nil {
		return domain.Appointment{}, err
	}
	if err := a.validateSchedule(item.Date, item.Time); err != nil {
		return domain.Appointment{}, err
	}
	return a.repo.Create(ctx, item)
}

func (a *Appointments) List(ctx context.Context, userID int) ([]domain.Appointment, error) {
	if userID <= 0 {
		return nil, domain.ErrUnauthorized
	}
	return a.repo.ListOwned(ctx, userID)
}

func (a *Appointments) Update(ctx context.Context, userID, id int, in AppointmentChange) (domain.Appointment, error) {
	if userID <= 0 {
		return domain.Appointment{}, domain.ErrUnauthorized
	}
	if id <= 0 {
		return domain.Appointment{}, domain.ErrNotFound
	}
	return a.repo.UpdateOwned(ctx, userID, id, func(item *domain.Appointment) error {
		if item.Status != "pending" && item.Status != "confirmed" && item.Status != "suggested" {
			return domain.ValidationError{Message: "This appointment can no longer be changed"}
		}
		if in.Status != nil {
			switch *in.Status {
			case "cancelled":
				if in.Date != nil || in.Time != nil || in.PetName != nil || in.PetType != nil || in.Service != nil || in.Notes != nil {
					return domain.ValidationError{Message: "Cancel separately from editing an appointment"}
				}
				item.Status = "cancelled"
				return nil
			case "confirmed":
				if item.Status != "suggested" {
					return domain.ValidationError{Message: "Only a suggested appointment can be confirmed by its owner"}
				}
			case "pending":
				if in.Date == nil && in.Time == nil {
					return domain.ValidationError{Message: "Provide a new date or time to reschedule"}
				}
			default:
				return domain.ValidationError{Message: "Invalid appointment status"}
			}
		}
		if in.PetName != nil {
			item.PetName = strings.TrimSpace(*in.PetName)
		}
		if in.PetType != nil {
			item.PetType = strings.TrimSpace(*in.PetType)
		}
		if in.Service != nil {
			item.Service = strings.TrimSpace(*in.Service)
		}
		if in.Notes != nil {
			item.Notes = strings.TrimSpace(*in.Notes)
		}
		if in.Date != nil {
			item.Date = *in.Date
		}
		if in.Time != nil {
			item.Time = *in.Time
		}
		if err := validateAppointment(*item); err != nil {
			return err
		}
		if err := a.validateSchedule(item.Date, item.Time); err != nil {
			return err
		}
		if in.Date != nil || in.Time != nil {
			item.Status = "pending"
		} else if in.Status != nil {
			item.Status = *in.Status
		}
		return nil
	})
}

func validateAppointment(item domain.Appointment) error {
	for _, value := range []string{item.Owner, item.Phone, item.PetName, item.PetType, item.Service} {
		if value == "" || utf8.RuneCountInString(value) > 200 || strings.ContainsRune(value, 0) {
			return domain.ValidationError{Message: "Owner, phone, pet name, pet type and service are required (maximum 200 characters each)"}
		}
	}
	if len(item.Phone) > 30 || utf8.RuneCountInString(item.Notes) > 2000 || strings.ContainsRune(item.Notes, 0) {
		return domain.ValidationError{Message: "Phone or notes are too long or invalid"}
	}
	return nil
}

func (a *Appointments) validateSchedule(date, slot string) error {
	// The clinic's schedule is in Bangkok time, independent of server timezone.
	zone := time.FixedZone("Asia/Bangkok", 7*60*60)
	when, err := time.ParseInLocation("2006-01-02 15:04", date+" "+slot, zone)
	if err != nil || when.Format("2006-01-02 15:04") != date+" "+slot || !when.After(a.now()) {
		return domain.ValidationError{Message: "Choose a valid future appointment date and time"}
	}
	valid := false
	for _, allowed := range []string{"09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"} {
		if slot == allowed {
			valid = true
			break
		}
	}
	if !valid {
		return domain.ValidationError{Message: "Choose an available clinic time slot"}
	}
	return nil
}
