import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Brands from "./pages/Brands/Brands";
import CollectionsPage from "./pages/Collections/CollectionsPage";
import NewArrival from "./pages/NewArrival/NewArrival";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Search from "./pages/Search/Search";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Admin from "./pages/Admin/Admin";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";

import "./App.css";

// Component to handle cart clearing on logout
function CartClearOnLogout() {
  const { isLoggedIn } = useAuth();
  const { clearCart } = useCart();
  
  useEffect(() => {
    // Store the previous login status to detect logout
    const wasLoggedIn = localStorage.getItem("wasLoggedIn");
    
    if (wasLoggedIn === "true" && !isLoggedIn) {
      // User was logged in but is now logged out
      clearCart();
    }
    
    // Update the storage
    localStorage.setItem("wasLoggedIn", isLoggedIn ? "true" : "false");
  }, [isLoggedIn, clearCart]);

  return null;
}

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

// Wraps the routed page and replays a subtle fade/slide on every navigation.
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/new-arrivals" element={<NewArrival />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CartClearOnLogout />
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;