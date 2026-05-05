import "./CollectionsPage.css";
import { useState, useEffect } from "react";

import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts } from "../../services/api";

function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(); // Fetch all products without filter
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="collections-page">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <main className="collections-page">
      <header className="collection-header">
        <h1>Collections</h1>
        <p>Discover our collections of luxury perfumes.</p>
      </header>

      <section className="collections-featured">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => console.log("Added:", product)}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </main>
  );
}

export default CollectionsPage;