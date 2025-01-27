package websocket

import (
	"log"
	"time"
	database "uas_project/config"
	"uas_project/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

// Membuat slice untuk menyimpan semua koneksi WebSocket
var clients = make([]*websocket.Conn, 0)

// Fungsi untuk menangani koneksi WebSocket dan broadcasting
func ProductStockHandler(c *websocket.Conn) {
	// Menambahkan koneksi yang baru
	clients = append(clients, c)

	// Menangani komunikasi WebSocket
	defer func() {
		// Menghapus koneksi dari list ketika klien menutup koneksi
		for i, client := range clients {
			if client == c {
				clients = append(clients[:i], clients[i+1:]...)
				break
			}
		}
		c.Close()
	}()

	// Kirim data produk ke klien yang terhubung setiap 10 detik
	for {
		var products []models.Product
		database.DB.Find(&products) // Ambil data produk dari database
		c.WriteJSON(products)       // Kirimkan produk ke klien yang terhubung
		// Menunggu selama 10 detik sebelum mengirim data lagi
		time.Sleep(10 * time.Second)
	}
}

// Fungsi untuk mengirim notifikasi transaksi kepada semua klien yang terhubung
func BroadcastTransaction(transaction models.Transaction) {
	// Kirim pesan notifikasi ke semua klien
	for _, client := range clients {
		err := client.WriteJSON(transaction)
		if err != nil {
			log.Println("Error sending message to client:", err)
		}
	}
}

// WebSocket route handler
func SetupWebSocket(app *fiber.App) {
	// Setup WebSocket route untuk product stock
	app.Get("/ws", websocket.New(ProductStockHandler))
}
