import "./Navbar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUser, FaCog } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/search?query=${query.trim()}`);
    setQuery("");
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/products")}>Products</button>
        <button onClick={() => navigate("/collections")}>Collections</button>
        <button onClick={() => navigate("/new-arrivals")}>New Arrivals</button>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <h1 onClick={() => navigate("/")}>NOIRE</h1>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <FaSearch />
          </button>
        </form>

        <div className="cart-icon-container">
          <FaShoppingCart
            className="icon"
            onClick={() => navigate("/cart")}
          />
          {cart.length > 0 && (
            <span className="cart-badge" onClick={() => navigate("/cart")}>
              {cart.length}
            </span>
          )}
        </div>

        {isAdmin && (
          <button className="admin-btn" onClick={() => navigate("/admin")}>
            <FaCog /> Admin
          </button>
        )}

        {isLoggedIn ? (
          <>
            <span className="user-name">{user?.fullName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="signin-btn" onClick={() => navigate("/login")}>
            <FaUser /> Sign In
          </button>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="modal-btn cancel" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;