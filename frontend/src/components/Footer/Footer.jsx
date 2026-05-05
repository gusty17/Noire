import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Links */}
        <div className="footer-section">
          <h3>Shop</h3>
          <a href="#">Collections</a>
          <a href="#">Bundles</a>
          <a href="#">Brands</a>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3>Support</h3>
          <a href="#">Contact</a>
          <a href="#">FAQ</a>
          <a href="#">Shipping</a>
        </div>

      </div>

      <p className="copyright">
        © 2026 NOIRE. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;