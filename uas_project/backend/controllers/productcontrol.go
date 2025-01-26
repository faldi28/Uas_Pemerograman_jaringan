package controllers

import (
	database "uas_project/config"
	"uas_project/models"

	"github.com/gofiber/fiber/v2"
)

// Create a new product
func CreateProduct(c *fiber.Ctx) error {
	product := new(models.Product)
	if err := c.BodyParser(product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse body"})
	}

	result := database.DB.Create(&product)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

// Get all products
func GetProducts(c *fiber.Ctx) error {
	var products []models.Product
	result := database.DB.Find(&products)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.JSON(products)
}

// Update a product by ID
func UpdateProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product

	// Check if product exists
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Parse the request body
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse body"})
	}

	// Update the product in the database
	result := database.DB.Save(&product)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.JSON(product)
}

// Delete a product by ID
func DeleteProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	var product models.Product

	// Check if product exists
	if err := database.DB.First(&product, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
	}

	// Delete the product from the database
	result := database.DB.Delete(&product)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.JSON(fiber.Map{"message": "Product deleted successfully"})
}
