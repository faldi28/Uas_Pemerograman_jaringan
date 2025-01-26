package middleware

import (
	auth "uas_project/utils"

	"github.com/gofiber/fiber/v2"
)

func ProtectRoute() fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := c.Get("Authorization")
		if token == "" {
			return c.Status(fiber.StatusUnauthorized).SendString("Unauthorized")
		}

		_, err := auth.ValidateToken(token)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).SendString("Invalid token")
		}

		return c.Next()
	}
}
