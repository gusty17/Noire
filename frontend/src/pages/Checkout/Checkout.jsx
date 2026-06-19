import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createOrder, addToCart as addToBackendCart, clearCart as clearBackendCart, updateUser } from "../../services/api";
import { useState } from "react";
import { EGYPT_CITIES, getShippingFee } from "../../constants/egyptCities";
import "./Checkout.css";
import Button from "../../components/Button/Button";

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    fullName: user?.fullName || "",
    address: "",
    city: EGYPT_CITIES[0],
    postalCode: "",
    phone: "",
  });

  const shippingFee = getShippingFee(formData.city);
  const orderTotal = total + shippingFee;

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  // Redirect to cart if no items
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before checking out</p>
            <Button 
              variant="primary" 
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSyncing(true);
    setError(null);

    try {
      // 📝 Update user profile with phone and address
      await updateUser(formData.fullName, formData.phone, formData.address);

      // 🧹 Clear backend cart first to avoid duplicates
      await clearBackendCart();

      // 🔄 Sync cart items with backend
      for (const item of cart) {
        await addToBackendCart(item.id, item.quantity);
      }

      // ✅ Create order
      await createOrder(formData.city);
      setOrderPlaced(true);
      clearCart();
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
      setLoading(false);
    } finally {
      setSyncing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order is being processed.</p>
            <p className="redirect-message">Redirecting you to home page...</p>
            <Button 
              variant="primary" 
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="checkout-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="checkout-item-image"
                  />
                  <div className="checkout-item-info">
                    <h4>{item.name}</h4>
                    <p>
                      {item.quantity} x {item.price.toFixed(2)} LE
                    </p>
                  </div>
                  <div className="checkout-item-total">
                    {(item.price * item.quantity).toFixed(2)} LE
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="totals-row">
                <span>Subtotal:</span>
                <span>{total.toFixed(2)} LE</span>
              </div>
              <div className="totals-row">
                <span>Shipping ({formData.city}):</span>
                <span>{shippingFee.toFixed(2)} LE</span>
              </div>
              <div className="totals-row total">
                <span>Total:</span>
                <span>{orderTotal.toFixed(2)} LE</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="shipping-section">
            <h2>Shipping Information</h2>
            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled
                  placeholder="Your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  >
                    {EGYPT_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="checkout-actions">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </Button>
                <button
                  type="submit"
                  className="btn-place-order"
                  disabled={loading || syncing}
                >
                  {loading || syncing ? "Processing..." : `Place Order - ${orderTotal.toFixed(2)} LE`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
