package usecase

import (
	"context"
	"net/mail"
	"net/url"
	"strings"
	"unicode/utf8"

	"pawplan/api/internal/domain"
)

type ProfileRepository interface {
	ByID(context.Context, int) (domain.User, error)
	UpdateProfile(context.Context, domain.User, string, string) (domain.User, error)
}

type Profile struct {
	users     ProfileRepository
	passwords PasswordHasher
}
type ProfileInput struct {
	Name, Email, Phone, CurrentPassword, NewPassword string
	Image                                            *string
}

func NewProfile(users ProfileRepository, passwords PasswordHasher) *Profile {
	return &Profile{users: users, passwords: passwords}
}

func (p *Profile) Update(ctx context.Context, userID int, token string, in ProfileInput) (domain.User, error) {
	if userID <= 0 {
		return domain.User{}, domain.ErrUnauthorized
	}
	u, err := p.users.ByID(ctx, userID)
	if err != nil {
		return domain.User{}, err
	}
	u.Email, u.Name, u.Phone = strings.ToLower(strings.TrimSpace(in.Email)), strings.TrimSpace(in.Name), strings.TrimSpace(in.Phone)
	parsed, err := mail.ParseAddress(u.Email)
	if err != nil || parsed.Address != u.Email || len(u.Email) > 254 {
		return domain.User{}, domain.ValidationError{Message: "A valid email is required"}
	}
	if u.Name == "" || utf8.RuneCountInString(u.Name) > 100 || len(u.Phone) > 30 || strings.ContainsRune(u.Name+u.Phone, 0) {
		return domain.User{}, domain.ValidationError{Message: "Name or phone is invalid"}
	}
	if in.Image != nil {
		image := *in.Image
		parsedImage, imageErr := url.Parse(image)
		isURL := imageErr == nil && (parsedImage.Scheme == "https" || parsedImage.Scheme == "http") && parsedImage.Host != ""
		isLocal := strings.HasPrefix(image, "/uploads/") || strings.HasPrefix(image, "/assets/")
		isData := strings.HasPrefix(image, "data:image/png;base64,") || strings.HasPrefix(image, "data:image/jpeg;base64,") || strings.HasPrefix(image, "data:image/webp;base64,") || strings.HasPrefix(image, "data:image/gif;base64,")
		if len(image) > 2100000 || strings.ContainsRune(image, 0) || (image != "" && !isURL && !isLocal && !isData) {
			return domain.User{}, domain.ValidationError{Message: "Use a PNG, JPEG, WebP or GIF image up to 1.5 MB"}
		}
		u.Image = image
	}
	oldHash := u.PasswordHash
	if in.NewPassword != "" {
		if len(in.CurrentPassword) > 16*1024 || !p.passwords.Matches(oldHash, in.CurrentPassword) {
			return domain.User{}, domain.ValidationError{Message: "Current password is incorrect"}
		}
		if utf8.RuneCountInString(in.NewPassword) < 8 || len(in.NewPassword) > 72 {
			return domain.User{}, domain.ValidationError{Message: "Password must be at least 8 characters and at most 72 bytes"}
		}
		u.PasswordHash, err = p.passwords.Hash(in.NewPassword)
		if err != nil {
			return domain.User{}, err
		}
	}
	return p.users.UpdateProfile(ctx, u, oldHash, hashToken(token))
}
