package main

import (
	database "uas_project/config"
	_ "uas_project/docs" //

	"uas_project/routes"

	"github.com/gofiber/fiber/v2"
	swagger "github.com/swaggo/fiber-swagger" //

	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"

	websocket "uas_project/websocket"

	"log"
)

func init() {
	// Load environment variables from .env file
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error in loading .env file.")
	}

	// Connect to the database
	database.ConnectDB()
}

func main() {
	// Initialize Fiber app
	app := fiber.New()

	// Enable CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Adjust to specify allowed origins, like "http://localhost:3000"
		AllowMethods: "GET,POST,PUT,DELETE",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Post("/users", routes.CreateUser)
	app.Get("/users", routes.GetUsers)
	app.Put("/users/:id", routes.UpdateUser)
	app.Delete("/users/:id", routes.DeleteUser)

	app.Post("/admins", routes.CreateAdmin)
	app.Get("/admins", routes.GetAdmins)

	app.Post("/products", routes.CreateProduct)
	app.Get("/products", routes.GetProducts)
	app.Put("/products/:id", routes.UpdateProduct)
	app.Delete("/products/:id", routes.DeleteProduct)

	app.Post("/transactions", routes.CreateTransactions)
	app.Get("/transactions", routes.GetTransactions)
	app.Put("/transactions/:id", routes.UpdateTransactions)
	app.Delete("/transactions/:id", routes.DeleteTransactions)

	// Register Swagger route
	app.Get("/swagger/*", swagger.WrapHandler) // Use WrapHandler for Swagger

	// Mendaftarkan WebSocket
	websocket.SetupWebSocket(app)
	// Start the app
	log.Fatal(app.Listen(":3000"))
}
