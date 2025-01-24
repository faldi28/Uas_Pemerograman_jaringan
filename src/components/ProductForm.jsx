import React, { useState } from "react";
import API from "../api/api";

const ProductForm = ({ fetchProducts }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/products", { name, price, quantity });
      fetchProducts();
      setName("");
      setPrice("");
      setQuantity("");
    } catch (err) {
      console.error("Failed to add product");
    }
  };

  return (
    <div className="box p-4">
      <h2 className="title is-5 has-text-centered">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <input
            className="input is-rounded is-medium"
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field mb-4">
          <input
            className="input is-rounded is-medium"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="field mb-4">
          <input
            className="input is-rounded is-medium"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <button
            className="button is-primary is-fullwidth is-medium is-rounded"
            type="submit"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
