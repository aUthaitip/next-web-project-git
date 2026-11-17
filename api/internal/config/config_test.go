package config

import (
	"net/url"
	"testing"
)

func TestNormalizeDatabaseURLPreservesSchema(t *testing.T) {
	for _, schema := range []string{"public", "clinic", "Clinic_2"} {
		t.Run(schema, func(t *testing.T) {
			raw := "postgresql://example:fake@localhost/pawplan?schema=" + schema + "&pgbouncer=true&sslmode=require"
			normalized, err := NormalizeDatabaseURL(raw)
			if err != nil {
				t.Fatal(err)
			}
			u, err := url.Parse(normalized)
			if err != nil {
				t.Fatal(err)
			}
			q := u.Query()
			if q.Get("search_path") != `"`+schema+`"` || q.Has("schema") || q.Has("pgbouncer") || q.Get("sslmode") != "require" {
				t.Fatal("schema selection or other PostgreSQL options were lost")
			}
		})
	}
}

func TestNormalizeDatabaseURLRejectsAmbiguousSchema(t *testing.T) {
	for _, query := range []string{"schema=", "schema=a&schema=b", "schema=clinic&search_path=public", "schema=clinic,public", "schema=%22clinic%22", "schema=123clinic", "schema=%ZZ"} {
		t.Run(query, func(t *testing.T) {
			if _, err := NormalizeDatabaseURL("postgresql://example:fake@localhost/pawplan?" + query); err == nil {
				t.Fatal("invalid schema accepted")
			}
		})
	}
	got, err := NormalizeDatabaseURL("postgresql://example:fake@localhost/pawplan?search_path=clinic")
	if err != nil {
		t.Fatal(err)
	}
	u, _ := url.Parse(got)
	if u.Query().Get("search_path") != "clinic" {
		t.Fatal("native search_path lost")
	}
}

func TestCookieConfiguration(t *testing.T) {
	for _, tc := range []struct {
		name, environment, origin, sameSite, want string
		wantError                                 bool
	}{
		{name: "local defaults", origin: "http://localhost:3000", want: "Lax"},
		{name: "production same site", environment: "production", origin: "https://app.example", sameSite: "lax", want: "Lax"},
		{name: "production cross site", environment: "production", origin: "https://app.example", sameSite: "none", want: "None"},
		{name: "insecure none", origin: "https://app.example", sameSite: "none", wantError: true},
		{name: "http frontend", environment: "production", origin: "http://app.example", sameSite: "none", wantError: true},
		{name: "unknown mode", origin: "http://localhost:3000", sameSite: "wrong", wantError: true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			t.Setenv("DATABASE_URL", "postgresql://example:fake@localhost/pawplan?schema=clinic")
			t.Setenv("APP_ENV", tc.environment)
			t.Setenv("FRONTEND_ORIGIN", tc.origin)
			t.Setenv("COOKIE_SAME_SITE", tc.sameSite)
			cfg, err := Load()
			if tc.wantError {
				if err == nil {
					t.Fatal("unsafe configuration accepted")
				}
				return
			}
			if err != nil {
				t.Fatal(err)
			}
			if cfg.CookieSameSite != tc.want || cfg.SecureCookies != (tc.environment == "production") {
				t.Fatal("incorrect cookie configuration")
			}
		})
	}
}
