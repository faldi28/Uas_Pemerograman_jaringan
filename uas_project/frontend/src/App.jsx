import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginUser from "./components/LoginUsers";
import LoginAdmin from "./components/LoginAdmin";
import RegisterUser from "./components/RegisterUser";
import RegisterAdmin from "./components/RegisterAdmin";
import ProductList from "./components/ProductList";
import TransactionList from "./components/TransactionList"; 

// Error Boundary Component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);  // Handle invalid token gracefully
      }
    }
  }, []);

  // If role is not determined (user hasn't logged in)
  if (role === null) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Login and Register Pages */}
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/login-admin" element={<LoginAdmin />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          
          {/* Admin only page for managing products */}
          <Route
            path="/products"
            element={role === "admin" ? <ProductList /> : <Navigate to="/login-admin" />}
          />

          {/* User only page for viewing transactions */}
          <Route
            path="/transactions"
            element={role === "user" ? <TransactionList /> : <Navigate to="/login-user" />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
