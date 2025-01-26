import React, { useEffect, useState } from "react";
import API from "../api/api";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [isUser, setIsUser] = useState(false); // Replace with actual user validation logic

  const fetchTransactions = async () => {
    try {
      const response = await API.post("/transactions");
      setTransactions(response.data.transactions); // Adjust according to your API structure
      setIsUser(response.data.isUser); // Replace with logic to check user role
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };


  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container">
      <h1 className="title has-text-centered">Transaction List</h1>
      {isUser ? (
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.productId}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.totalPrice}</td>
                <td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="has-text-danger">
          You do not have permission to view this page.
        </p>
      )}
    </div>
  );
};

export default TransactionList;
