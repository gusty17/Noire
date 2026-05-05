import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import CollectionsPage from "./pages/Collections/CollectionsPage";
import NewArrival from "./pages/NewArrival/NewArrival";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Search from "./pages/Search/Search";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Admin from "./pages/Admin/Admin";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/new-arrivals" element={<NewArrival />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;