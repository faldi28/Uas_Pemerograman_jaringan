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
	product.Use(middleware.AdminOnly)                 // Middleware untuk semua rute produk (hanya admin)
	product.Get("/", controllers.GetProduct)          // Mendapatkan semua produk
	product.Post("/", controllers.CreateProduct)      // Menambahkan produk baru
	product.Put("/:id", controllers.UpdateProduct)    // Memperbarui produk berdasarkan ID
	product.Delete("/:id", controllers.DeleteProduct) // Menghapus produk berdasarkan ID

	// Transaction routes (User only)
	transaction := api.Group("/transactions")
	transaction.Use(middleware.UserOnly)                       // Middleware untuk semua rute transaksi (hanya user)
	transaction.Get("/", controllers.GetTransactions)          // Mendapatkan semua transaksi pengguna
	transaction.Post("/", controllers.CreateTransactions)      // Membuat transaksi baru
	transaction.Put("/:id", controllers.UpdateTransactions)    // Memperbarui transaksi berdasarkan ID
	transaction.Delete("/:id", controllers.DeleteTransactions) // Menghapus transaksi berdasarkan ID (opsional, jika diperlukan user)

	// Global error handler for invalid routes
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Endpoint not found",
		})
	})
}
