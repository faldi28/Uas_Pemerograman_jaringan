import React, { useEffect, useState } from "react";
import API from "../api/api";

const TransactionForm = ({ fetchTransactions, transactionToEdit }) => {
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    total_price: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        product_id: transactionToEdit.product_id,
        quantity: transactionToEdit.quantity,
        total_price: transactionToEdit.total_price,
      });
    }
  }, [transactionToEdit]);

  useEffect(() => {
    // Fetch product list for the dropdown
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (transactionToEdit) {
        await API.put(`/transactions/${transactionToEdit.id}`, formData);
      } else {
        await API.post("/transactions", formData);
      }
      fetchTransactions();
      setFormData({ product_id: "", quantity: "", total_price: "" });
    } catch (err) {
      console.error("Failed to save transaction", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Product</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Quantity</label>
        <div className="control">
          <input
            className="input"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Total Price</label>
        <div className="control">
          <input
            className="input"
            type="number"
            name="total_price"
            value={formData.total_price}
            onChange={handleChange}
            placeholder="Enter total price"
            required
          />
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button type="submit" className="button is-primary">
            {transactionToEdit ? "Update" : "Create"}
          </button>
        </div>
        <div className="control">
          <button
            type="button"
            className="button is-light"
            onClick={() => setFormData({ product_id: "", quantity: "", total_price: "" })}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await API.get("/transactions");
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  const handleLogout = () => {
    // Example logic for logging out: clearing tokens or session
    localStorage.removeItem("userToken"); // Assuming token is saved in localStorage
    window.location.href = "/login-user"; // Redirecting to login page after logout
  };

  return (
    <div className="container">
      <h1 className="title">Transaction Management</h1>
      <TransactionForm
        fetchTransactions={fetchTransactions}
        transactionToEdit={transactionToEdit}
      />

      <h2 className="title is-4">Transaction List</h2>
      <table className="table is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(transactions) && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.product_name}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.total_price}</td>
                <td>
                  <button
                    className="button is-small is-info"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    Edit
                  </button>
                  <button
                    className="button is-small is-danger"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="has-text-centered">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="field is-grouped">
        <div className="control">
          <button
            className="button is-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
