import React, { useEffect, useState } from "react";
import API from "../api/api";
import TransactionForm from "./TransactionForm";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await API.get("/transactions");
      setTransactions(response.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

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

  return (
    <div>
      <TransactionForm fetchTransactions={fetchTransactions} transactionToEdit={transactionToEdit} />
      <h2 className="title is-4">Transaction List</h2>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.productId}</td>
              <td>{transaction.quantity}</td>
              <td>{transaction.totalPrice}</td>
              <td>
                <button className="button is-small is-info" onClick={() => handleEditTransaction(transaction)}>Edit</button>
                <button className="button is-small is-danger" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
