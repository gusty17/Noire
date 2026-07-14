import "./Footer.css";
import { useNavigate } from "react-router-dom";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { useScrollReveal } from "../../hooks/useScrollReveal";

function Footer() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal({ y: 24 });

  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner" ref={revealRef}>
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <h2 onClick={() => navigate("/")}>NOIRE</h2>
            <p>
              Curated fashion for those who appreciate the art of understated
              elegance. Delivered across Egypt.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div className="footer-section">
              <h3>Shop</h3>
              <a onClick={() => navigate("/products")}>Products</a>
              <a onClick={() => navigate("/collections")}>Collections</a>
              <a onClick={() => navigate("/brands")}>Brands</a>
              <a onClick={() => navigate("/new-arrivals")}>New Arrivals</a>
            </div>

            <div className="footer-section">
              <h3>Support</h3>
              <a href="mailto:support@noire.com">support@noire.com</a>
              <a href="tel:+201012660158">+20 101 266 0158</a>
              <a>Shipping across Egypt</a>
            </div>

            <div className="footer-section">
              <h3>Company</h3>
              <a onClick={() => navigate("/")}>Home</a>
              <a>About Us</a>
              <a>Returns &amp; Exchanges</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {year} NOIRE. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a>Privacy Policy</a>
            <a>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
