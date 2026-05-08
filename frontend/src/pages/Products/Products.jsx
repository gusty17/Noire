import "./Products.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts, searchProducts } from "../../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchParams] = useSearchParams();

  // Initialize search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Debounce search query - only search after user stops typing for 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = debouncedQuery 
          ? await searchProducts(debouncedQuery)
          : await getProducts();
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (error) {
    return (
      <main className="products-page">
        <header className="products-header">
          <h1>Products</h1>
          <p className="error-message">{error}</p>
        </header>
      </main>
    );
  }

  return (
    <main className="products-page">
      <header className="products-header">
        <h1>Our Products</h1>
        <p>Browse our premium fragrances</p>
      </header>

      <div className="products-search">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <section className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => console.log("Added:", product)}
              />
            ))
          ) : (
            <p className="no-products">No products found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default Products;
