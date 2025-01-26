// src/components/DashboardAdmin.js
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link to="/api/products">View Products</Link></li>
        <li><Link to="/api/products/add">Add New Product</Link></li>
        <li><Link to="/api/transactions">View Transactions</Link></li>
        <li><Link to="/api/transactions/update">Update Transactions</Link></li>
        <li><Link to="/api/transactions/delete">Delete Transactions</Link></li>
      </ul>
    </div>
  );
};

export default DashboardAdmin;
