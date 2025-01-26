import React, { useState, useEffect } from "react";
import API from "../api/api";

const TransactionForm = ({ fetchTransactions, transactionToEdit }) => {
  const [productId, setProductId] = useState(transactionToEdit?.productId || "");
  const [quantity, setQuantity] = useState(transactionToEdit?.quantity || "");
  const [totalPrice, setTotalPrice] = useState(transactionToEdit?.totalPrice || "");
  const [products, setProducts] = useState([]);

  // Fetch products when component is mounted
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products"); // Get all products
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Calculate total price based on quantity and selected product price
  useEffect(() => {
    const selectedProduct = products.find((product) => product.id === parseInt(productId));
    if (selectedProduct && quantity) {
      setTotalPrice(selectedProduct.price * quantity);
    }
  }, [productId, quantity, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (transactionToEdit) {
        await API.put(`/transactions/${transactionToEdit.id}`, { productId, quantity, totalPrice });
      } else {
        await API.post("/transactions", { productId, quantity, totalPrice });
      }
      fetchTransactions();
      setProductId("");
      setQuantity("");
      setTotalPrice("");
    } catch (err) {
      console.error("Failed to add/update transaction", err);
    }
  };

  return (
    <div className="box p-4">
      <h2 className="title is-5 has-text-centered">
        {transactionToEdit ? "Edit Transaction" : "Add New Transaction"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label className="label">Product</label>
          <div className="control">
            <div className="select is-rounded is-medium">
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field mb-4">
          <label className="label">Quantity</label>
          <input
            className="input is-rounded is-medium"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="field mb-4">
          <label className="label">Total Price</label>
          <input
            className="input is-rounded is-medium"
            type="number"
            placeholder="Total Price"
            value={totalPrice}
            readOnly
          />
        </div>
        <div className="field">
          <button
            className="button is-primary is-fullwidth is-medium is-rounded"
            type="submit"
          >
            {transactionToEdit ? "Update Transaction" : "Add Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
