import "./FeaturedProducts.css";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts } from "../../services/api";
import { useScrollReveal } from "../../hooks/useScrollReveal";

function FeaturedProducts({ searchQuery = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ stagger: 0.08 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts(searchQuery);
        // Show only first 8 products as featured
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  if (loading) {
    return (
      <section className="featured">
        <div className="featured-header">
          <h2>Featured Products</h2>
          <p>Loading our curated selection of premium fragrances...</p>
        </div>
        <div className="grid">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="featured">
      <div className="featured-header" ref={headerRef}>
        <h2>Featured Products</h2>
        <p>Explore our curated selection of premium fragrances</p>
      </div>

      <div className="grid" ref={gridRef}>
        {products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.id}
              {...p}
              onAddToCart={() => console.log("Added:", p)}
            />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;