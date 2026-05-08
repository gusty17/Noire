import "./Footer.css";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const handleShopCollection = () => {
    navigate("/collections");
  };
  const handleShopBrands = () => {
    navigate("/brands");
  }
  const handleShopProducts = () => {
    navigate("/products");
  }
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Links */}
        <div className="footer-section">
          <h3>Shop</h3>
          <a href="#" onClick={handleShopProducts}>
            Products
          </a>
          <a href="#" onClick={handleShopCollection}>
            Collections
          </a>
          <a href="#" onClick={handleShopBrands}>
            Brands
          </a>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <a>Email: support@noire.com</a>
          <a>Phone: +20 123 456 7890</a>
          <a>Shipping Available Across Egypt</a>  
        </div>

      </div>
    </footer>
  );
}

export default Footer;