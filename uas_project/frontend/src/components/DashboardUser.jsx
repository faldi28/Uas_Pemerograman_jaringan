// src/components/DashboardUser.js
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardUser = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <ul>
        <li><Link to="/api/transactions/add">Create New Transaction</Link></li>
      </ul>
    </div>
  );
};

export default DashboardUser;
