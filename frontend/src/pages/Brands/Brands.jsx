import "./Brands.css";
import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts } from "../../services/api";

function Brands() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortedBrands, setSortedBrands] = useState([]);

  useEffect(() => {
    const fetchAndGroupProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        const products = Array.isArray(data) ? data : [];

        // Group products by brand
        const grouped = {};
        products.forEach((product) => {
          const brand = product.brandName || "Uncategorized";
          if (!grouped[brand]) {
            grouped[brand] = [];
          }
          grouped[brand].push(product);
        });

        // Sort brands alphabetically
        const brands = Object.keys(grouped).sort();
        setSortedBrands(brands);
        setGroupedProducts(grouped);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupProducts();
  }, []);

  const handleProductDeleted = (productId) => {
    const updated = { ...groupedProducts };
    Object.keys(updated).forEach((brand) => {
      updated[brand] = updated[brand].filter((p) => p.id !== productId);
      if (updated[brand].length === 0) {
        delete updated[brand];
      }
    });
    setGroupedProducts(updated);
    setSortedBrands(Object.keys(updated).sort());
  };

  if (error) {
    return (
      <main className="brands-page">
        <header className="brands-header">
          <h1>All Brands</h1>
          <p className="error-message">{error}</p>
        </header>
      </main>
    );
  }

  return (
    <main className="brands-page">
      <header className="brands-header">
        <h1>All Brands</h1>
        <p>Explore our complete collection of premium fragrances by brand</p>
      </header>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : sortedBrands.length > 0 ? (
        <div className="brands-container">
          {sortedBrands.map((brand) => (
            <section key={brand} className="brand-section">
              <div className="brand-header">
                <h2>{brand}</h2>
                <p className="product-count">
                  {groupedProducts[brand].length} products
                </p>
              </div>
              <div className="brand-products-grid">
                {groupedProducts[brand].map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onProductDeleted={handleProductDeleted}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="no-products">No products found.</p>
      )}
    </main>
  );
}

export default Brands;
