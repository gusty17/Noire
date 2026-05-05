import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getProductById } from "../../services/api";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="error">Product not found.</p>;

  const displayImage = product.imageUrl || "https://via.placeholder.com/400";

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: displayImage,
    }, isLoggedIn);
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-image-section">
          <img src={displayImage} alt={product.name} className="product-image" />
        </div>
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-meta">
            <p><strong>Stock:</strong> {product.stock} units available</p>
            {product.brand && <p><strong>Brand:</strong> {product.brand?.name || 'N/A'}</p>}
            {product.collection && <p><strong>Collection:</strong> {product.collection?.name || 'N/A'}</p>}
          </div>
          <div className="product-actions">
            <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
            <button className="btn btn-secondary">Add to Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;