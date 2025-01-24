package models

type User struct {
	ID           uint   `gorm:"primaryKey"`
	Username     string `gorm:"unique"`
	Password     string
	Role         string        // "user" or "admin"
	Transactions []Transaction // One-to-many relationship with Transaction
}
