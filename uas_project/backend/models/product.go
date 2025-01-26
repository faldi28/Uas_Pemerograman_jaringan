package models

type Product struct {
	ID           uint   `gorm:"primaryKey"`
	Name         string `gorm:"unique"`
	Stock        int    // Quantity available
	Price        float64
	Transactions []Transaction // One-to-many relationship with Transaction
}
