import React, { useEffect, useState } from "react";
import API from "../api/api";
import ProductForm from "./ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product.");
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container is-max-desktop">
      <div className="box p-4">
        <h2 className="title is-5 has-text-centered">Products</h2>
        {error && <p className="notification is-danger is-light has-text-centered">{error}</p>}
        <ProductForm fetchProducts={fetchProducts} />
      </div>
      <div className="box p-4">
        <h3 className="title is-6 has-text-centered">Product List</h3>
        {products.length === 0 ? (
          <p className="notification is-warning is-light has-text-centered">No products available.</p>
        ) : (
          <table className="table is-striped is-fullwidth is-hoverable">
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
                  <td>${product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      className="button is-small is-danger is-outlined"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Products;
