import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { removeFromCart as removeFromBackendCart } from "../../services/api";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleRemoveItem = async (itemId) => {
    try {
      // Remove from frontend cart
      removeFromCart(itemId);
      // Sync with backend
      await removeFromBackendCart(itemId);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Your Cart</h1>
          </div>

          {cart.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image || "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.name}</h3>
                      <p className="cart-item-price">{item.price} LE</p>
                      <p className="cart-item-quantity">Quantity: {item.quantity}</p>
                      <button
                        className="cart-item-remove"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h2 className="cart-total">Total: {total.toFixed(2)} LE</h2>
                <div className="cart-actions">
                  <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
                  <button className="btn btn-secondary" onClick={handleContinueShopping}>Continue Shopping</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
}

export default Cart;