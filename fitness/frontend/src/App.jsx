import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Schedule from "./pages/Schedule";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role_id !== 1 && user.role_id !== 3) return <Navigate to="/" />;
  return children;
}

function UserOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user && (user.role_id === 1 || user.role_id === 3)) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Menu />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <UserOnlyRoute>
                      <Cart />
                    </UserOnlyRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <UserOnlyRoute>
                      <Checkout />
                    </UserOnlyRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <UserOnlyRoute>
                      <Dashboard />
                    </UserOnlyRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;