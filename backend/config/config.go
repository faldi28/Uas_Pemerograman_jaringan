package database

import (
	"log"
	"os"
	"uas_project/models"
	"time"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	// Load database credentials from environment variables
	host := os.Getenv("db_host")
	user := os.Getenv("db_user")
	password := os.Getenv("db_password")
	dbname := os.Getenv("db_name")

	// Construct DSN
	var dsn string
	if password == "" {
		dsn = user + "@tcp(" + host + ":3306)/" + dbname + "?charset=utf8mb4&parseTime=True&loc=Local"
	} else {
		dsn = user + ":" + password + "@tcp(" + host + ":3306)/" + dbname + "?charset=utf8mb4&parseTime=True&loc=Local"
	}

	// Configure GORM logger
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // Logger output
		logger.Config{
			SlowThreshold:             200 * time.Millisecond, // Threshold for slow queries
			LogLevel:                  logger.Warn,           // Log level
			IgnoreRecordNotFoundError: true,                  // Ignore errors for record not found
			Colorful:                  true,                  // Enable colorful logs
		},
	)

	// Open database connection
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection successful.")

	// Migrate models
	DB.AutoMigrate(&models.User{}, &models.Admin{}, &models.Product{}, &models.Transaction{})
}
