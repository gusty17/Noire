import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { deleteProduct, addToCart as addToBackendCart } from "../../services/api";
import "./ProductCard.css";
import Button from "../Button/Button";

function ProductCard({ id, name, price, imageUrl, image, stock, onProductDeleted }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn, isAdmin } = useAuth();

  const BASE_URL = "http://localhost:5000";
  const inStock = stock > 0;

  const goToDetails = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!inStock) return;

    try {
      // Add to frontend cart
      addToCart(
        {
          id,
          name,
          price,
          image: displayImage,
        },
        isLoggedIn
      );

      // Sync with backend
      await addToBackendCart(id, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    navigate(`/admin?editProduct=${id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id);
        alert("Product deleted successfully!");
        if (onProductDeleted) {
          onProductDeleted(id);
        }
      } catch (error) {
        alert("Error deleting product: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // 🔥 FIXED IMAGE URL
  const displayImage = imageUrl
    ? `${BASE_URL}${imageUrl}`
    : image || "https://via.placeholder.com/200";

  return (
    <div className="product-card" onClick={goToDetails}>
      <img src={displayImage} alt={name} />

      <div className="product-info">
        <h3>{name}</h3>
        <p>
          {typeof price === "number" ? price.toFixed(2) : price} LE
        </p>
        <p className={`stock-status ${inStock ? "in-stock" : "out-of-stock"}`}>
          {inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      {isAdmin ? (
        <div className="admin-actions">
          <Button variant="secondary" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      ) : !inStock ? (
        <Button variant="secondary" disabled>
          Out of Stock
        </Button>
      ) : (
        <Button
          variant={isLoggedIn ? "primary" : "secondary"}
          onClick={handleAddToCart}
        >
          {isLoggedIn ? "Add to Cart" : "Sign in to Buy"}
        </Button>
      )}
    </div>
  );
}

export default ProductCard;