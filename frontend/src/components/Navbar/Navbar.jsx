import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { FaShoppingCart, FaSearch, FaUser, FaCog } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { cartItems , cartCount } = useCart();
  const { isLoggedIn, isAdmin, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`);
      setSearchInput("");
    }
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
         <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        <button onClick={() => navigate("/")}>HOME</button>
        <button onClick={() => navigate("/products")}>PRODUCTS</button>
        <button onClick={() => navigate("/collections")}>COLLECTIONS</button>
        <button onClick={() => navigate("/brands")}>BRANDS</button>
      </div>

      {/* CENTER */}
      <div className="nav-center" onClick={() => navigate("/")}>
        <h1>NOIRE</h1>
      </div>

      {/* RIGHT */}
      <div className="nav-right">


        {/* SEARCH */}
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>

        {/* CART */}
        <div
          className="cart-icon-container"
          onClick={() => navigate("/cart")}
        >
          <span className="icon">🛒</span>
          {cartCount  > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </div>
        
        {isAdmin && (
          <button className="admin-btn" onClick={() => navigate("/admin")}>
            <FaCog /> Admin
          </button>
        )}

        {/*  AUTH BUTTON  */}
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            className="signin-btn"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        )}

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => handleNavigation("/")}>Home</button>
          <button onClick={() => handleNavigation("/collections")}>
            Collections
          </button>
          <button onClick={() => handleNavigation("/brands")}>Brands</button>

          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={() => handleNavigation("/login")}>
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;