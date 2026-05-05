import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts } from "../../services/api";
import "./Search.css";

function Search() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts(query);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <main className="search-page">
        <div className="search-header">
          <h1>Search Results for "{query}"</h1>
        </div>

        {loading && <div className="loading">Loading products...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="search-results">
            {products.length > 0 ? (
              products.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))
            ) : (
              <p className="no-results">No products found for "{query}".</p>
            )}
          </div>
        )}
      </main>
  );
}

export default Search;