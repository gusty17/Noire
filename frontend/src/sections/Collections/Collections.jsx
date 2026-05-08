import "./Collections.css";
import { useState, useEffect } from "react";
import { getCollections } from "../../services/api";
import { useNavigate } from "react-router-dom";
function Collections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
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
    navigate(`/collections`);
  };

  return (
    <section className="collections">
      <div className="collections-header">
        <h2>Collections</h2>
        <p>Explore our collections.</p>
      </div>

      <div className="collection-grid">
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