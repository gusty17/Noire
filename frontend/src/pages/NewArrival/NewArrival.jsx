import "./NewArrival.css";
import { useState, useEffect } from "react";

import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts } from "../../services/api";

function NewArrival() {
  const [searchQuery, setSearchQuery] = useState("");
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setNewArrivals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = newArrivals.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="new-arrival-page">
        <header className="new-arrival-header">
          <h1>New Arrivals</h1>
          <p>Loading our latest scents...</p>
        </header>
        <div className="loading">Loading...</div>
      </main>
    );
  }

  return (
    <main className="new-arrival-page">
        <header className="new-arrival-header">
          <h1>New Arrivals</h1>
          <p>Discover our latest scents, handpicked for you.</p>
        </header>

        <section className="new-arrival-grid">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((item) => (
              <ProductCard
                key={item.id}
                {...item}
                onAddToCart={() => console.log("Added:", item)}
              />
            ))
          ) : (
            <p>No new arrivals match your search.</p>
          )}
        </section>
      </main>
  );
}

export default NewArrival;