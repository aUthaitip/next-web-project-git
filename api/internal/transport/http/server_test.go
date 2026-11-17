package http

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"pawplan/api/internal/domain"
	"pawplan/api/internal/usecase"
)

func TestRateLimitOnlyTrustsConfiguredProxy(t *testing.T) {
	for _, trusted := range []bool{false, true} {
		t.Run(fmt.Sprintf("trusted=%v", trusted), func(t *testing.T) {
			options := Options{FrontendOrigin: "http://localhost:3000"}
			if trusted {
				options.TrustedProxies = []string{"0.0.0.0"}
			}
			app := New(stubAuth{}, func(context.Context) error { return nil }, options)
			for i := 0; i < 11; i++ {
				req := httptest.NewRequest("POST", "/api/auth/login", strings.NewReader(`{}`))
				req.Header.Set("Content-Type", "application/json")
				req.Header.Set("X-Forwarded-For", fmt.Sprintf("192.0.2.%d", i+1))
				res, err := app.Test(req)
				if err != nil {
					t.Fatal(err)
				}
				res.Body.Close()
				want := 200
				if !trusted && i == 10 {
					want = 429
				}
				if res.StatusCode != want {
					t.Fatalf("request %d: got %d, want %d", i, res.StatusCode, want)
				}
			}
		})
	}
}

type stubAuth struct{ failure error }

func (s stubAuth) Register(context.Context, usecase.RegisterInput) (domain.User, error) {
	return domain.User{ID: 1, PasswordHash: "must-not-leak"}, s.failure
}
func (s stubAuth) Login(context.Context, string, string) (domain.User, string, error) {
	return domain.User{ID: 1, PasswordHash: "must-not-leak"}, "session-token", s.failure
}
func (s stubAuth) Me(context.Context, string) (domain.User, error) {
	return domain.User{ID: 1}, s.failure
}
func (s stubAuth) Logout(context.Context, string) error { return s.failure }

func TestHTTPBoundaries(t *testing.T) {
	for _, tc := range []struct {
		name, method, path, body, origin, contentType string
		failure                                       error
		status                                        int
	}{
		{name: "malformed JSON", method: "POST", path: "/api/auth/register", body: "{", contentType: "application/json", status: 400},
		{name: "extra fields", method: "POST", path: "/api/auth/register", body: `{"role":"admin"}`, contentType: "application/json", status: 400},
		{name: "multiple bodies", method: "POST", path: "/api/auth/login", body: `{} {}`, contentType: "application/json", status: 400},
		{name: "form submission", method: "POST", path: "/api/auth/login", body: "email=x", contentType: "application/x-www-form-urlencoded", status: 415},
		{name: "cross origin logout", method: "POST", path: "/api/auth/logout", origin: "https://evil.example", status: 403},
		{name: "duplicate", method: "POST", path: "/api/auth/register", body: `{}`, contentType: "application/json", failure: domain.ErrEmailTaken, status: 409},
		{name: "anonymous", method: "GET", path: "/api/auth/me", failure: domain.ErrUnauthorized, status: 401},
		{name: "database failure", method: "GET", path: "/api/auth/me", failure: errors.New("secret database password"), status: 500},
	} {
		t.Run(tc.name, func(t *testing.T) {
			app := New(stubAuth{failure: tc.failure}, func(context.Context) error { return nil }, Options{FrontendOrigin: "http://localhost:3000"})
			req := httptest.NewRequest(tc.method, tc.path, strings.NewReader(tc.body))
			req.Header.Set("Content-Type", tc.contentType)
			req.Header.Set("Origin", tc.origin)
			res, err := app.Test(req)
			if err != nil {
				t.Fatal(err)
			}
			defer res.Body.Close()
			b, _ := io.ReadAll(res.Body)
			if res.StatusCode != tc.status {
				t.Fatalf("status %d: %s", res.StatusCode, b)
			}
			if strings.Contains(string(b), "secret database password") {
				t.Fatal("internal error leaked")
			}
		})
	}
}

func TestCookieAndCORS(t *testing.T) {
	app := New(stubAuth{}, func(context.Context) error { return nil }, Options{FrontendOrigin: "https://app.example", SecureCookies: true})
	req := httptest.NewRequest("POST", "/api/auth/login", strings.NewReader(`{"email":"x@example.test","password":"password123"}`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "https://app.example")
	res, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		t.Fatalf("login %d", res.StatusCode)
	}
	cookies := res.Cookies()
	if len(cookies) != 1 || !cookies[0].HttpOnly || !cookies[0].Secure || cookies[0].Path != "/api" {
		t.Fatal("unsafe cookie options")
	}
	if res.Header.Get("Access-Control-Allow-Origin") != "https://app.example" || res.Header.Get("Access-Control-Allow-Credentials") != "true" {
		t.Fatal("missing credentialed CORS")
	}
	b, _ := io.ReadAll(res.Body)
	if strings.Contains(string(b), "must-not-leak") || strings.Contains(string(b), "session-token") {
		t.Fatal("secret in JSON response")
	}
	req = httptest.NewRequest("POST", "/api/auth/logout", nil)
	res, err = app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	if res.StatusCode != 204 || res.Cookies()[0].MaxAge != -1 {
		t.Fatal("logout must expire cookie")
	}
}

func TestHealthReportsUnavailableDatabase(t *testing.T) {
	app := New(stubAuth{}, func(context.Context) error { return errors.New("offline") }, Options{FrontendOrigin: "http://localhost:3000"})
	res, err := app.Test(httptest.NewRequest("GET", "/api/health", nil))
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	if res.StatusCode != 503 {
		t.Fatalf("status %d", res.StatusCode)
	}
}

func TestCrossSiteOriginAndCookies(t *testing.T) {
	const allowed = "https://frontend.example"
	for _, tc := range []struct {
		name, mode, origin, site string
		status                   int
	}{
		{name: "allowed cross site", mode: "None", origin: allowed, site: "cross-site", status: 200},
		{name: "allowed without fetch metadata", mode: "None", origin: allowed, status: 200},
		{name: "untrusted origin", mode: "None", origin: "https://evil.example", site: "cross-site", status: 403},
		{name: "missing origin", mode: "None", site: "cross-site", status: 403},
		{name: "missing origin and metadata", mode: "None", status: 403},
		{name: "null origin", mode: "None", origin: "null", site: "cross-site", status: 403},
		{name: "origin prefix attack", mode: "None", origin: allowed + ".evil.test", site: "cross-site", status: 403},
		{name: "lax blocks cross site", mode: "Lax", origin: allowed, site: "cross-site", status: 403},
		{name: "lax allows same site", mode: "Lax", origin: allowed, site: "same-site", status: 200},
	} {
		t.Run(tc.name, func(t *testing.T) {
			app := New(stubAuth{}, func(context.Context) error { return nil }, Options{FrontendOrigin: allowed, SecureCookies: true, CookieSameSite: tc.mode})
			req := httptest.NewRequest("POST", "/api/auth/login", strings.NewReader(`{"email":"review@example.test","password":"test-password"}`))
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Origin", tc.origin)
			req.Header.Set("Sec-Fetch-Site", tc.site)
			res, err := app.Test(req)
			if err != nil {
				t.Fatal(err)
			}
			defer res.Body.Close()
			if res.StatusCode != tc.status {
				t.Fatalf("got %d want %d", res.StatusCode, tc.status)
			}
			if tc.status != 200 {
				return
			}
			cookies := res.Cookies()
			if len(cookies) != 1 || !cookies[0].Secure || !cookies[0].HttpOnly {
				t.Fatal("unsafe cookies")
			}
			if tc.mode == "None" && cookies[0].SameSite != http.SameSiteNoneMode {
				t.Fatal("missing SameSite=None")
			}
			if tc.mode == "Lax" && cookies[0].SameSite != http.SameSiteLaxMode {
				t.Fatal("missing SameSite=Lax")
			}
			if res.Header.Get("Access-Control-Allow-Origin") != allowed || res.Header.Get("Access-Control-Allow-Credentials") != "true" {
				t.Fatal("CORS credentials missing")
			}
		})
	}
}

func TestCrossSiteLogoutRequiresOriginAndClearsMatchingCookie(t *testing.T) {
	const allowed = "https://frontend.example"
	app := New(stubAuth{}, func(context.Context) error { return nil }, Options{FrontendOrigin: allowed, SecureCookies: true, CookieSameSite: "None"})
	for _, origin := range []string{"", "https://evil.example", allowed} {
		req := httptest.NewRequest("POST", "/api/auth/logout", nil)
		req.Header.Set("Origin", origin)
		req.AddCookie(&http.Cookie{Name: CookieName, Value: "test-session"})
		res, err := app.Test(req)
		if err != nil {
			t.Fatal(err)
		}
		res.Body.Close()
		if origin != allowed {
			if res.StatusCode != 403 {
				t.Fatal("logout CSRF was accepted")
			}
			continue
		}
		cookies := res.Cookies()
		if res.StatusCode != 204 || len(cookies) != 1 || cookies[0].MaxAge != -1 || cookies[0].SameSite != http.SameSiteNoneMode || !cookies[0].Secure || cookies[0].Path != "/api" {
			t.Fatal("logout cookie differs from login cookie")
		}
	}
}

func TestCrossSitePreflight(t *testing.T) {
	const allowed = "https://frontend.example"
	app := New(stubAuth{}, func(context.Context) error { return nil }, Options{FrontendOrigin: allowed, SecureCookies: true, CookieSameSite: "None"})
	req := httptest.NewRequest("OPTIONS", "/api/auth/login", nil)
	req.Header.Set("Origin", allowed)
	req.Header.Set("Access-Control-Request-Method", "POST")
	req.Header.Set("Access-Control-Request-Headers", "Content-Type")
	res, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	if res.StatusCode != 204 || res.Header.Get("Access-Control-Allow-Origin") != allowed || res.Header.Get("Access-Control-Allow-Credentials") != "true" {
		t.Fatal("preflight rejected")
	}
}
