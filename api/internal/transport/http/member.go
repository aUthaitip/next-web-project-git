package http

import (
	"context"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"
	"pawplan/api/internal/domain"
	"pawplan/api/internal/usecase"
)

type AppointmentService interface {
	Book(context.Context, int, usecase.BookingInput) (domain.Appointment, error)
	List(context.Context, int) ([]domain.Appointment, error)
	Update(context.Context, int, int, usecase.AppointmentChange) (domain.Appointment, error)
}
type ProfileService interface {
	Update(context.Context, int, string, usecase.ProfileInput) (domain.User, error)
}
type NotificationService interface {
	List(context.Context, int) ([]domain.Notification, error)
	Read(context.Context, int, int, bool) error
}

type appointmentResponse struct {
	ID         int       `json:"id"`
	Owner      string    `json:"owner"`
	Phone      string    `json:"phone"`
	PetName    string    `json:"petName"`
	PetType    string    `json:"petType"`
	Service    string    `json:"service"`
	Date       string    `json:"date"`
	Time       string    `json:"time"`
	Status     string    `json:"status"`
	Notes      string    `json:"notes"`
	DoctorName string    `json:"doctorName"`
	CreatedAt  time.Time `json:"createdAt"`
}

func publicAppointment(a domain.Appointment) appointmentResponse {
	return appointmentResponse{a.ID, a.Owner, a.Phone, a.PetName, a.PetType, a.Service, a.Date, a.Time, a.Status, a.Notes, a.DoctorName, a.CreatedAt}
}

// RegisterMemberRoutes authenticates every member operation from the opaque
// cookie. Neither user IDs nor appointment ownership are trusted from JSON.
func RegisterMemberRoutes(app *fiber.App, auth AuthService, appointments AppointmentService, profile ProfileService, notifications NotificationService) {
	currentUser := func(c fiber.Ctx) (domain.User, error) { return auth.Me(c.Context(), c.Cookies(CookieName)) }
	app.Get("/api/appointments/mine", func(c fiber.Ctx) error {
		u, err := currentUser(c)
		if err != nil {
			return err
		}
		items, err := appointments.List(c.Context(), u.ID)
		if err != nil {
			return err
		}
		response := make([]appointmentResponse, 0, len(items))
		for _, item := range items {
			response = append(response, publicAppointment(item))
		}
		return c.JSON(response)
	})
	app.Post("/api/appointments", func(c fiber.Ctx) error {
		u, err := currentUser(c)
		if err != nil {
			return err
		}
		var in struct {
			Owner   string `json:"owner"`
			Phone   string `json:"phone"`
			PetName string `json:"petName"`
			PetType string `json:"petType"`
			Service string `json:"service"`
			Date    string `json:"date"`
			Time    string `json:"time"`
			Notes   string `json:"notes"`
		}
		if err := decode(c, &in); err != nil {
			return err
		}
		item, err := appointments.Book(c.Context(), u.ID, usecase.BookingInput{Owner: in.Owner, Phone: in.Phone, PetName: in.PetName, PetType: in.PetType, Service: in.Service, Date: in.Date, Time: in.Time, Notes: in.Notes})
		if err != nil {
			return err
		}
		return c.Status(201).JSON(publicAppointment(item))
	})
	app.Patch("/api/appointments/:id", func(c fiber.Ctx) error {
		u, err := currentUser(c)
		if err != nil {
			return err
		}
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil || id <= 0 {
			return fiber.NewError(400, "Invalid appointment ID")
		}
		var in struct {
			Status  *string `json:"status"`
			Date    *string `json:"date"`
			Time    *string `json:"time"`
			PetName *string `json:"petName"`
			PetType *string `json:"petType"`
			Service *string `json:"service"`
			Notes   *string `json:"notes"`
		}
		if err := decode(c, &in); err != nil {
			return err
		}
		item, err := appointments.Update(c.Context(), u.ID, id, usecase.AppointmentChange{Status: in.Status, Date: in.Date, Time: in.Time, PetName: in.PetName, PetType: in.PetType, Service: in.Service, Notes: in.Notes})
		if err != nil {
			return err
		}
		return c.JSON(publicAppointment(item))
	})
	app.Put("/api/profile", func(c fiber.Ctx) error {
		u, err := currentUser(c)
		if err != nil {
			return err
		}
		var in struct {
			Name            string  `json:"name"`
			Email           string  `json:"email"`
			Phone           string  `json:"phone"`
			Image           *string `json:"image"`
			CurrentPassword string  `json:"currentPassword"`
			NewPassword     string  `json:"newPassword"`
		}
		if err := decode(c, &in); err != nil {
			return err
		}
		u, err = profile.Update(c.Context(), u.ID, c.Cookies(CookieName), usecase.ProfileInput{Name: in.Name, Email: in.Email, Phone: in.Phone, Image: in.Image, CurrentPassword: in.CurrentPassword, NewPassword: in.NewPassword})
		if err != nil {
			return err
		}
		return c.JSON(publicUser(u))
	})
	app.Get("/api/notifications", func(c fiber.Ctx) error {
		u, err := currentUser(c)
		if err != nil {
			return err
		}
		items, err := notifications.List(c.Context(), u.ID)
		if err != nil {
			return err
		}
		type notificationResponse struct {
			ID        int       `json:"id"`
			Message   string    `json:"message"`
			Read      bool      `json:"read"`
			CreatedAt time.Time `json:"createdAt"`
		}
		response := make([]notificationResponse, 0, len(items))
		for _, item := range items {
			response = append(response, notificationResponse{item.ID, item.Message, item.Read, item.CreatedAt})
		}
		return c.JSON(fiber.Map{"notifications": response})
	})
	app.Patch("/api/notifications", func(c fiber.Ctx) error {
		u, err := currentUser(c)
		if err != nil {
			return err
		}
		var in struct {
			ID  int  `json:"id"`
			All bool `json:"all"`
		}
		if err := decode(c, &in); err != nil {
			return err
		}
		if err := notifications.Read(c.Context(), u.ID, in.ID, in.All); err != nil {
			return err
		}
		return c.SendStatus(204)
	})
}
