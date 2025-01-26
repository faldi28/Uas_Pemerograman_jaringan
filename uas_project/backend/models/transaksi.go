package models

type Transaction struct {
	ID        uint `gorm:"primaryKey"`
	ProductID uint `gorm:"foreignKey:ProductID"` // Foreign key to Product table
	UserID    uint `gorm:"foreignKey:UserID"`    // Foreign key to User table
	Quantity  int
	Total     float64
	Product   Product `gorm:"foreignKey:ProductID"` // Associating Product model
	User      User    `gorm:"foreignKey:UserID"`    // Associating User model
}
