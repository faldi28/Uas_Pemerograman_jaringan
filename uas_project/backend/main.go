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
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error in loading .env file.")
	}
	database.ConnectDB()
}

func main() {
	app := fiber.New()

	// cors
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",                                           // Gantilah dengan domain yang sesuai untuk keamanan jika perlu
		AllowMethods: "GET,POST,PUT,DELETE",                         // Tambahkan metode lain jika diperlukan
		AllowHeaders: "Origin, Content-Type, Accept, Authorization", // Menambahkan Authorization
	}))

	// Routes
	routes.SetupRoutes(app)

	// Register Swagger route
	app.Get("/swagger/*", swagger.WrapHandler) // Use WrapHandler for Swagger

	// Mendaftarkan WebSocket
	websocket.SetupWebSocket(app)

	// Start the app
	log.Fatal(app.Listen(":3000"))
}
