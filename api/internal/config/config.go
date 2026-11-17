package config

import (
	"errors"
	"fmt"
	"net/netip"
	"net/url"
	"os"
	"regexp"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	DatabaseURL    string
	ListenAddress  string
	FrontendOrigin string
	SecureCookies  bool
	CookieSameSite string
	TrustedProxies []string
}

// Load is called from api/. OS variables win, then api/.env, then ../.env.
func Load() (Config, error) {
	for _, path := range []string{".env", "../.env"} {
		if err := godotenv.Load(path); err != nil && !errors.Is(err, os.ErrNotExist) {
			return Config{}, fmt.Errorf("cannot read %s", path)
		}
	}
	c := Config{DatabaseURL: os.Getenv("DATABASE_URL"), ListenAddress: value("API_ADDR", "127.0.0.1:8080"), FrontendOrigin: value("FRONTEND_ORIGIN", "http://localhost:3000"), SecureCookies: os.Getenv("APP_ENV") == "production"}
	for _, proxy := range strings.Split(os.Getenv("TRUSTED_PROXIES"), ",") {
		proxy = strings.TrimSpace(proxy)
		if proxy == "" {
			continue
		}
		if _, err := netip.ParseAddr(proxy); err != nil {
			if _, err := netip.ParsePrefix(proxy); err != nil {
				return Config{}, errors.New("TRUSTED_PROXIES must contain comma-separated IP addresses or CIDR ranges")
			}
		}
		c.TrustedProxies = append(c.TrustedProxies, proxy)
	}
	var err error
	c.DatabaseURL, err = NormalizeDatabaseURL(c.DatabaseURL)
	if err != nil {
		return Config{}, err
	}
	origin, err := url.Parse(c.FrontendOrigin)
	if err != nil || origin.Host == "" || (origin.Scheme != "http" && origin.Scheme != "https") || origin.User != nil || origin.Path != "" || origin.RawQuery != "" || origin.Fragment != "" {
		return Config{}, errors.New("FRONTEND_ORIGIN must be an exact http(s) origin without a trailing slash")
	}
	if c.SecureCookies && origin.Scheme != "https" {
		return Config{}, errors.New("production FRONTEND_ORIGIN must use HTTPS")
	}
	switch strings.ToLower(value("COOKIE_SAME_SITE", "lax")) {
	case "lax":
		c.CookieSameSite = "Lax"
	case "none":
		if !c.SecureCookies {
			return Config{}, errors.New("COOKIE_SAME_SITE=none requires APP_ENV=production and HTTPS on both frontend and API")
		}
		c.CookieSameSite = "None"
	default:
		return Config{}, errors.New("COOKIE_SAME_SITE must be lax or none")
	}
	return c, nil
}

var schemaName = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]{0,62}$`)

// NormalizeDatabaseURL preserves Prisma's schema selection in pgx. A single
// quoted search_path entry avoids case folding and fallback into public.
func NormalizeDatabaseURL(raw string) (string, error) {
	u, err := url.Parse(raw)
	if err != nil || u.Host == "" || (u.Scheme != "postgresql" && u.Scheme != "postgres") {
		return "", errors.New("DATABASE_URL must be a PostgreSQL connection URL")
	}
	q, err := url.ParseQuery(u.RawQuery)
	if err != nil {
		return "", errors.New("DATABASE_URL query parameters are invalid")
	}
	if values, exists := q["schema"]; exists {
		if len(values) != 1 || !schemaName.MatchString(values[0]) {
			return "", errors.New("database schema must be a single identifier of 1-63 ASCII letters, digits or underscores, starting with a letter or underscore")
		}
		if q.Has("search_path") {
			return "", errors.New("set either schema or search_path in DATABASE_URL, not both")
		}
		q.Set("search_path", `"`+values[0]+`"`)
		q.Del("schema")
	}
	q.Del("pgbouncer")
	u.RawQuery = q.Encode()
	return u.String(), nil
}

func value(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
