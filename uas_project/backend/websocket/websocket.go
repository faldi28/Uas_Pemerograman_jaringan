package websocket

import (
    "github.com/gofiber/websocket/v2"
    "uas_project/config"
    "uas_project/models"
    "github.com/gofiber/fiber/v2"
)

func ProductStockHandler(c *websocket.Conn) {
    for {
        var products []models.Product
        database.DB.Find(&products)
        c.WriteJSON(products)
    }
}

// WebSocket route handler
func SetupWebSocket(app *fiber.App) {
    app.Get("/ws", websocket.New(ProductStockHandler))
}
