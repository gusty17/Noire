import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getProductById, deleteProduct } from "../../services/api";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isLoggedIn, isAdmin } = useAuth();

  const BASE_URL = "http://localhost:5000";

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

  const displayImage = product.imageUrl
    ? `${BASE_URL}${product.imageUrl}`
    : "https://via.placeholder.com/400";

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: displayImage,
    }, isLoggedIn);
  };

  const handleUpdate = () => {
    navigate(`/admin?editProduct=${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(id);
        alert("Product deleted successfully!");
        navigate("/");
      } catch (err) {
        alert("Error deleting product: " + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <div className="product-image-section">
          <img src={displayImage} alt={product.name} className="product-image" />
        </div>
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">{typeof product.price === 'number' ? product.price.toFixed(2) : product.price} LE</p>
          <p className="product-description">{product.description}</p>
          <p className={`stock-status ${inStock ? "in-stock" : "out-of-stock"}`}>
            {inStock ? "In Stock" : "Out of Stock"}
          </p>
          <div className="product-actions">
            {isAdmin ? (
              <>
                <button className="btn btn-secondary" onClick={handleUpdate}>Update Product</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete Product</button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button className="btn btn-secondary">Add to Wishlist</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;