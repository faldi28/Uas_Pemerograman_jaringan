package routes

import (
	"uas_project/controllers"
	"uas_project/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// Base API group
	api := app.Group("/api")

	// Auth routes
	api.Post("/register", controllers.RegisterHandler) // Route untuk registrasi
	api.Post("/login", controllers.LoginHandler)       // Route untuk login

	// Product routes (Admin only)
	product := api.Group("/products")
	product.Use(middleware.AdminOnly)                  // Middleware untuk semua rute produk
	product.Get("/", controllers.GetProducts)         // Mendapatkan semua produk
	product.Post("/", controllers.CreateProduct)      // Menambahkan produk baru
	product.Put("/:id", controllers.UpdateProduct)    // Memperbarui produk berdasarkan ID
	product.Delete("/:id", controllers.DeleteProduct) // Menghapus produk berdasarkan ID

	// Transaction routes
	transaction := api.Group("/transactions")

	// Rute untuk user dan admin
	transaction.Get("/", controllers.GetTransactions)

	// Rute hanya untuk user
	userTransaction := transaction.Group("")
	userTransaction.Use(middleware.UserOnly) // Middleware untuk pengguna biasa
	userTransaction.Post("/", controllers.CreateTransactions)
	userTransaction.Put("/:id", controllers.UpdateTransactions)

	// Rute hanya untuk admin
	adminTransaction := transaction.Group("")
	adminTransaction.Use(middleware.AdminOnly) // Middleware untuk admin
	adminTransaction.Delete("/:id", controllers.DeleteTransactions)

	// Global error handler for invalid routes
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Endpoint not found",
		})
	})
}
