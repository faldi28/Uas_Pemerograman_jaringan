import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductForm from "./ProductForm";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product); // Mengatur produk yang sedang diedit
  };

  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts(); // Memperbarui daftar produk setelah penghapusan
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  return (
    <div>
      <ProductForm fetchProducts={fetchProducts} productToEdit={productToEdit} />
      <h2 className="title is-4">Product List</h2>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <button
                  className="button is-small is-info"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
                <button
                  className="button is-small is-danger"
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

export default ProductList;
