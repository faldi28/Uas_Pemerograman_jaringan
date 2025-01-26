import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginUser from "./components/LoginUsers";
import LoginAdmin from "./components/LoginAdmin";
import RegisterUser from "./components/RegisterUser";
import RegisterAdmin from "./components/RegisterAdmin";
import ProductList from "./components/ProductList";
import TransactionList from "./components/TransactionList"; 
import TransactionForm from "./components/TransactionForm"; 
import DashboardAdmin from "./components/DashboardAdmin"; 
import DashboardUser from "./components/DashboardUser"; 

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  // If role is not determined (user hasn't logged in)
  if (role === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Login and Register Pages */}
        <Route path="/login-user" element={<LoginUser />} />
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/register-admin" element={<RegisterAdmin />} />
        
        {/* Role Dashboard */}
        <Route 
          path="/dashboard-admin" 
          element={role === 'admin' ? <DashboardAdmin /> : <Navigate to="/login-admin" />} 
        />
        <Route 
          path="/dashboard-user" 
          element={role === 'user' ? <DashboardUser /> : <Navigate to="/login-user" />} 
        />

        {/* routes admin */}
        <Route 
          path="/products" 
          element={role === 'admin' ? <ProductList /> : <Navigate to="/login-admin" />} 
        />

        {/* List transaksi untuk admin */}
        <Route 
          path="/transactions" 
          element={role === 'admin' ? <TransactionList /> : <Navigate to="/login-user" />} 
        />
        
        {/* hanya admin yang bisa delete */}
        <Route 
          path="/transactions/delete/:id" 
          element={role === 'admin' ? <TransactionList /> : <Navigate to="/login-admin" />} 
        />

         {/* Hanya User yang bisa edit*/}
         <Route 
          path="/transactions/edit/:id" 
          element={role === 'admin' ? <TransactionList /> : <Navigate to="/login-admin" />} 
        />

        {/* Hanya user yang bisa post */}
        <Route 
          path="/transactions/add" 
          element={role === 'user' ? <TransactionForm /> : <Navigate to="/login-user" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
