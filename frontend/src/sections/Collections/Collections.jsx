import "./Collections.css";
import { useState, useEffect } from "react";
import { getCollections } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal({ stagger: 0.08 });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const result = await getCollections();
        const data = (Array.isArray(result) ? result : []).filter(
          (item) => item.productCount == null || item.productCount > 0
        );
        const featured = data.filter((item) => item.isFeatured);
        const rest = data.filter((item) => !item.isFeatured);
        setCollections([...featured, ...rest].slice(0, 4));
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return <div className="collections"><p>Loading collections...</p></div>;
  }
  const handleCollectionClick = (collectionId) => {
    navigate(`/products?collectionId=${collectionId}`);
  };

  return (
    <section className="collections">
      <div className="collections-header" ref={headerRef}>
        <h2>Collections</h2>
        <p>Explore our collections.</p>
      </div>

      <div className="collection-grid" ref={gridRef}>
        {collections.length > 0 ? (
          collections.map((item) => (
            <button
              key={item.id}
              className="collection-card"
              onClick={() => handleCollectionClick(item.id)}
            >
              <span className="collection-name">{item.name}</span>
              <span className="collection-subtext">
                Shop the latest
              </span>
            </button>
          ))
        ) : (
          <p>No collections available.</p>
        )}
      </div>
    </section>
  );
}

export default Collections;