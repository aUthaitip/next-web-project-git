// Package http adapts HTTP requests to application use cases.
package http

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"mime"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/fiber/v3/middleware/limiter"
	"github.com/gofiber/fiber/v3/middleware/recover"
	"pawplan/api/internal/domain"
	"pawplan/api/internal/usecase"
)

const CookieName = "pawplan-go-session"

type AuthService interface {
	Register(context.Context, usecase.RegisterInput) (domain.User, error)
	Login(context.Context, string, string) (domain.User, string, error)
	Me(context.Context, string) (domain.User, error)
	Logout(context.Context, string) error
}

type Options struct {
	FrontendOrigin string
	SecureCookies  bool
	CookieSameSite string
	TrustedProxies []string
}

type handler struct {
	auth    AuthService
	options Options
}

type userResponse struct {
	ID         int    `json:"id"`
	Email      string `json:"email"`
	Name       string `json:"name"`
	Phone      string `json:"phone"`
	Image      string `json:"image"`
	LineUserID string `json:"lineUserId"`
}

func publicUser(u domain.User) userResponse {
	return userResponse{ID: u.ID, Email: u.Email, Name: u.Name, Phone: u.Phone, Image: u.Image, LineUserID: u.LineUserID}
}

func New(auth AuthService, ready func(context.Context) error, options Options) *fiber.App {
	if options.CookieSameSite == "" {
		options.CookieSameSite = "Lax"
	}
	if options.CookieSameSite == "None" && !options.SecureCookies {
		panic("SameSite=None requires Secure cookies")
	}
	h := handler{auth: auth, options: options}
	app := fiber.New(fiber.Config{AppName: "PawPlan API", BodyLimit: 3 * 1024 * 1024, ReadTimeout: 10 * time.Second, WriteTimeout: 15 * time.Second, ErrorHandler: errorHandler, TrustProxy: true, TrustProxyConfig: fiber.TrustProxyConfig{Proxies: options.TrustedProxies}, ProxyHeader: "X-Forwarded-For", EnableIPValidation: true})
	app.Use(recover.New())
	app.Use(func(c fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(c.Context(), 10*time.Second)
		defer cancel()
		c.SetContext(ctx)
		c.Set("Cache-Control", "no-store")
		c.Set("X-Content-Type-Options", "nosniff")
		if c.Path() != "/api/profile" && len(c.Body()) > 16*1024 {
			return fiber.NewError(413, "Request body is too large")
		}
		// CORS alone does not reject state-changing requests. Validate Origin too.
		if c.Method() != "GET" && c.Method() != "HEAD" && c.Method() != "OPTIONS" {
			origin := c.Get("Origin")
			if origin != "" && origin != options.FrontendOrigin {
				return fiber.NewError(fiber.StatusForbidden, "Origin is not allowed")
			}
			// Cross-site cookies lose SameSite's CSRF protection: every mutation
			// must carry the exact trusted Origin, including login and logout.
			if options.CookieSameSite == "None" && origin != options.FrontendOrigin {
				return fiber.NewError(fiber.StatusForbidden, "Trusted Origin is required")
			}
			if c.Get("Sec-Fetch-Site") == "cross-site" && (options.CookieSameSite != "None" || origin != options.FrontendOrigin) {
				return fiber.NewError(fiber.StatusForbidden, "Cross-site request is not allowed")
			}
		}
		return c.Next()
	})
	app.Use(cors.New(cors.Config{AllowOrigins: []string{options.FrontendOrigin}, AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "OPTIONS"}, AllowHeaders: []string{"Content-Type"}, AllowCredentials: true}))
	app.Get("/api/health", func(c fiber.Ctx) error {
		if err := ready(c.Context()); err != nil {
			return c.Status(503).JSON(fiber.Map{"status": "unhealthy"})
		}
		return c.JSON(fiber.Map{"status": "healthy"})
	})
	limit := func() fiber.Handler {
		return limiter.New(limiter.Config{Max: 10, Expiration: time.Minute, LimitReached: func(c fiber.Ctx) error { return fiber.NewError(429, "Too many attempts; try again later") }})
	}
	app.Post("/api/auth/register", limit(), h.register)
	app.Post("/api/auth/login", limit(), h.login)
	app.Get("/api/auth/me", h.me)
	app.Post("/api/auth/logout", h.logout)
	return app
}

func decode(c fiber.Ctx, target any) error {
	mediaType, _, err := mime.ParseMediaType(c.Get("Content-Type"))
	if err != nil || mediaType != "application/json" {
		return fiber.NewError(415, "Content-Type must be application/json")
	}
	decoder := json.NewDecoder(bytes.NewReader(c.Body()))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(target); err != nil {
		return fiber.NewError(400, "Invalid JSON body or unknown field")
	}
	if err := decoder.Decode(new(any)); err != io.EOF {
		return fiber.NewError(400, "Body must contain one JSON object")
	}
	return nil
}

func (h handler) register(c fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Name     string `json:"name"`
		Phone    string `json:"phone"`
	}
	if err := decode(c, &input); err != nil {
		return err
	}
	user, err := h.auth.Register(c.Context(), usecase.RegisterInput{Email: input.Email, Password: input.Password, Name: input.Name, Phone: input.Phone})
	if err != nil {
		return err
	}
	return c.Status(201).JSON(publicUser(user))
}

func (h handler) login(c fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := decode(c, &input); err != nil {
		return err
	}
	user, token, err := h.auth.Login(c.Context(), input.Email, input.Password)
	if err != nil {
		return err
	}
	h.setCookie(c, token, int(usecase.SessionTTL.Seconds()), time.Now().Add(usecase.SessionTTL))
	return c.JSON(publicUser(user))
}

func (h handler) me(c fiber.Ctx) error {
	user, err := h.auth.Me(c.Context(), c.Cookies(CookieName))
	if err != nil {
		return err
	}
	return c.JSON(publicUser(user))
}

func (h handler) logout(c fiber.Ctx) error {
	if err := h.auth.Logout(c.Context(), c.Cookies(CookieName)); err != nil {
		return err
	}
	h.setCookie(c, "", -1, time.Unix(1, 0))
	return c.SendStatus(204)
}

func (h handler) setCookie(c fiber.Ctx, token string, maxAge int, expires time.Time) {
	c.Cookie(&fiber.Cookie{Name: CookieName, Value: token, HTTPOnly: true, Secure: h.options.SecureCookies, SameSite: h.options.CookieSameSite, Path: "/api", MaxAge: maxAge, Expires: expires})
}

func errorHandler(c fiber.Ctx, err error) error {
	status, message := 500, "Internal server error"
	var validation domain.ValidationError
	var httpError *fiber.Error
	switch {
	case errors.As(err, &validation):
		status, message = 400, validation.Message
	case errors.Is(err, domain.ErrEmailTaken):
		status, message = 409, "Email is already registered"
	case errors.Is(err, domain.ErrUnauthorized):
		status, message = 401, "Invalid credentials or session"
	case errors.Is(err, domain.ErrNotFound):
		status, message = 404, "Not found"
	case errors.As(err, &httpError):
		status, message = httpError.Code, httpError.Message
	case errors.Is(err, context.DeadlineExceeded):
		status, message = 503, "Service temporarily unavailable"
	default:
		slog.Error("API request failed", "method", c.Method(), "path", c.Path())
	}
	return c.Status(status).JSON(fiber.Map{"error": message})
}
