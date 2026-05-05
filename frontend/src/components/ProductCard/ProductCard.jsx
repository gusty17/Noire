import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./ProductCard.css";
import Button from "../Button/Button";

function ProductCard({ id, name, price, imageUrl, image }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const BASE_URL = "http://localhost:5000";

  const goToDetails = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    addToCart(
      {
        id,
        name,
        price,
        imageUrl: imageUrl || image,
      },
      isLoggedIn
    );
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
          $
          {typeof price === "number" ? price.toFixed(2) : price}
        </p>
      </div>

      <Button variant="primary" onClick={handleAddToCart}>
        Add to Cart
      </Button>
    </div>
  );
}

export default ProductCard;