package middleware

import (
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4" // Menggunakan versi terbaru dari golang-jwt/jwt
)

// JWT Secret Key (gunakan variabel terpusat)
var jwtSecret = []byte("secret_key")

// Role Constants
const (
	RoleAdmin = "admin"
	RoleUser  = "user"
)

// AdminOnly middleware: hanya untuk role admin
func AdminOnly(c *fiber.Ctx) error {
	userRole, err := getRoleFromToken(c)
	if err != nil || userRole != RoleAdmin {
		// Jika error atau role bukan admin, kembalikan status Forbidden
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied"})
	}
	// Melanjutkan ke middleware atau handler berikutnya
	return c.Next()
}

// UserOnly middleware: hanya untuk role user
func UserOnly(c *fiber.Ctx) error {
	userRole, err := getRoleFromToken(c)
	if err != nil || userRole != RoleUser {
		// Jika error atau role bukan user, kembalikan status Forbidden
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied"})
	}
	// Melanjutkan ke middleware atau handler berikutnya
	return c.Next()
}

// Helper function: Extract role from JWT token
func getRoleFromToken(c *fiber.Ctx) (string, error) {
	// Log header Authorization
	authHeader := c.Get("Authorization")
	fmt.Println("Authorization Header:", authHeader)

	if authHeader == "" {
		return "", fiber.NewError(fiber.StatusUnauthorized, "Authorization header is missing")
	}

	// Log token bagian setelah "Bearer"
	parts := strings.Split(authHeader, "Bearer ")
	if len(parts) != 2 {
		return "", fiber.NewError(fiber.StatusUnauthorized, "Invalid Authorization header format")
	}
	fmt.Println("Token String:", parts[1])

	// Decode token
	token, err := jwt.Parse(parts[1], func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		fmt.Println("Token Parse Error:", err)
		return "", fiber.NewError(fiber.StatusUnauthorized, "Invalid or expired token")
	}

	// Log klaim token
	claims, ok := token.Claims.(jwt.MapClaims)
	fmt.Println("Token Claims:", claims)
	if !ok || claims["role"] == nil {
		return "", fiber.NewError(fiber.StatusUnauthorized, "Role not found in token")
	}

	// Log peran pengguna
	role, ok := claims["role"].(string)
	fmt.Println("User Role:", role)
	if !ok {
		return "", fiber.NewError(fiber.StatusUnauthorized, "Invalid role format")
	}

	return role, nil
}
