package controllers

import (
	database "uas_project/config"
	"uas_project/models"

	"github.com/gofiber/fiber/v2"
)

// Create a new transaction
func CreateTransactions(c *fiber.Ctx) error {
	transaction := new(models.Transaction)
	if err := c.BodyParser(transaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse body"})
	}

	result := database.DB.Create(&transaction)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(transaction)
}

// Get all transactions
func GetTransactions(c *fiber.Ctx) error {
	var transactions []models.Transaction
	result := database.DB.Find(&transactions)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.JSON(transactions)
}

// Update a transaction by ID
func UpdateTransactions(c *fiber.Ctx) error {
	id := c.Params("id") // Get the transaction ID from the URL
	var transaction models.Transaction

	// Find the transaction by ID
	if err := database.DB.First(&transaction, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Transaction not found"})
	}

	// Parse the updated data from the request body
	if err := c.BodyParser(&transaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse body"})
	}

	// Save the updated transaction
	if err := database.DB.Save(&transaction).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(transaction)
}

// Delete a transaction by ID
func DeleteTransactions(c *fiber.Ctx) error {
	id := c.Params("id") // Get the transaction ID from the URL
	var transaction models.Transaction

	// Find the transaction by ID
	if err := database.DB.First(&transaction, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Transaction not found"})
	}

	// Delete the transaction
	if err := database.DB.Delete(&transaction).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Transaction deleted successfully"})
}
