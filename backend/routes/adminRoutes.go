package routes

import (
    "uas_project/models"
    "uas_project/config"
    "github.com/gofiber/fiber/v2"
)

// Create a new admin
func CreateAdmin(c *fiber.Ctx) error {
    admin := new(models.Admin)
    if err := c.BodyParser(admin); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse body"})
    }

    result := database.DB.Create(&admin)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.Status(fiber.StatusCreated).JSON(admin)
}

// Get all admins
func GetAdmins(c *fiber.Ctx) error {
    var admins []models.Admin
    result := database.DB.Find(&admins)
    if result.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
    }

    return c.JSON(admins)
}
