package domain

import "time"

type Appointment struct {
	ID                                               int
	UserID                                           int
	Patient, Owner, Phone, PetName, PetType, Service string
	Date, Time, Status, Notes, DoctorName            string
	CreatedAt, UpdatedAt                             time.Time
}

type Notification struct {
	ID        int
	Message   string
	Read      bool
	CreatedAt time.Time
}
