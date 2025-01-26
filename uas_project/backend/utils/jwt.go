package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// Secret key for signing JWT
var secretKey = []byte("your-secret-key")

// CustomClaims struct to include role information
type CustomClaims struct {
	Role string `json:"role"` // Menyertakan role di token
	jwt.RegisteredClaims
}

// GenerateToken generates a JWT token with username and role
func GenerateToken(username string, role string) (string, error) {
	// Claims including username and role
	claims := &CustomClaims{
		Role: role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token expires in 24 hours
			Subject:   username,
		},
	}

	// Create token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

// ValidateToken validates a JWT token and returns the claims
func ValidateToken(tokenStr string) (*CustomClaims, error) {
	// Parse token with custom claims
	token, err := jwt.ParseWithClaims(tokenStr, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Verifying the signing method is HS256
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.NewValidationError("unexpected signing method", jwt.ValidationErrorSignatureInvalid)
		}
		return secretKey, nil
	})

	// Handle errors related to token parsing and validity
	if err != nil {
		return nil, err
	}

	// Extract claims
	claims, ok := token.Claims.(*CustomClaims)
	if !ok {
		return nil, jwt.NewValidationError("unable to extract claims", jwt.ValidationErrorClaimsInvalid)
	}

	return claims, nil
}
