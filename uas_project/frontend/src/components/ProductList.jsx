import React, { useState, useEffect } from "react";
import API from "../api/api";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [productToEdit, setProductToEdit] = useState(null);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, stock, price };

      if (productToEdit) {
        // Update existing product
        await API.put(`/products/${productToEdit.id}`, payload);
      } else {
        // Add new product
        await API.post("/products", payload);
      }

      fetchProducts(); // Refresh product list
      resetForm();
    } catch (err) {
      console.error("Failed to add/update product", err);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setStock("");
    setPrice("");
    setProductToEdit(null);
  };

  // Handle edit button click
  const handleEditProduct = (product) => {
    setName(product.name);
    setStock(product.stock);
    setPrice(product.price);
    setProductToEdit(product);
  };

  // Handle delete button click
  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear auth token
    window.location.href = "/login-admin"; // Redirect to login page
  };

  return (
    <div className="container">
      <h1 className="title has-text-centered">Product Manager</h1>

      {/* Logout Button */}
      <div className="has-text-right">
        <button className="button is-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Form for adding/updating products */}
      <div className="box">
        <h2 className="title is-5">{productToEdit ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Product Name</label>
            <input
              className="input"
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label className="label">Stock</label>
            <input
              className="input"
              type="number"
              placeholder="Enter stock quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="field">
            <label className="label">Price</label>
            <input
              className="input"
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>

          <div className="field">
            <button className="button is-primary" type="submit">
              {productToEdit ? "Update Product" : "Add Product"}
            </button>
            {productToEdit && (
              <button
                type="button"
                className="button is-light ml-2"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table displaying product list */}
      <h2 className="title is-5">Product List</h2>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>{product.price}</td>
              <td>
                <button
                  className="button is-small is-info"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger ml-2"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
