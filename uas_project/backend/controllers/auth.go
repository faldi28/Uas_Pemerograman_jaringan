package controllers

import (
	"time"
	database "uas_project/config"
	"uas_project/models" // Sesuaikan dengan path model Anda

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	// Sesuaikan dengan path konfigurasi database Anda
)

var jwtSecret = []byte("secret_key") // Ganti dengan secret key yang lebih aman

// RegisterHandler: Mendaftarkan pengguna baru
func RegisterHandler(c *fiber.Ctx) error {
	type RegisterRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Role     string `json:"role"` // Tambahkan role
	}

	var body RegisterRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Validasi input
	if body.Username == "" || body.Password == "" || body.Role == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Username, password, and role are required"})
	}

	// Validasi role
	if body.Role != "admin" && body.Role != "user" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid role"})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not hash password"})
	}

	// Simpan pengguna ke database
	user := models.User{
		Username: body.Username,
		Password: string(hashedPassword),
		Role:     body.Role, // Simpan role
	}
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not save user"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "User registered successfully"})
}

// LoginHandler: Autentikasi pengguna
// LoginHandler: Autentikasi pengguna
func LoginHandler(c *fiber.Ctx) error {
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var body LoginRequest
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Cari pengguna di database
	var user models.User
	if err := database.DB.Where("username = ?", body.Username).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid username or password"})
	}

	// Periksa password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid username or password"})
	}

	// Buat token JWT
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = user.Username
	claims["role"] = user.Role // Tambahkan role ke dalam token
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}

	// Return token and role
	return c.JSON(fiber.Map{
		"token": tokenString,
		"role":  user.Role, // Return the role
	})
}
