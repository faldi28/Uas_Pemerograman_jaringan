package controllers

import (
	database "uas_project/config"
	"uas_project/models"
	"uas_project/websocket"

	"github.com/gofiber/fiber/v2"
)

// Fungsi untuk menangani transaksi
func CreateTransactions(c *fiber.Ctx) error {
	var transaction models.Transaction
	if err := c.BodyParser(&transaction); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid input",
		})
	}

	// Simpan transaksi ke database
	if err := database.DB.Create(&transaction).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create transaction",
		})
	}

	// Kirim notifikasi transaksi baru ke semua klien melalui WebSocket
	websocket.BroadcastTransaction(transaction)

	// Mengembalikan respons transaksi yang baru dibuat
	return c.Status(fiber.StatusOK).JSON(transaction)
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
