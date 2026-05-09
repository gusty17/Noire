import "./Brands.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBrands } from "../../services/api";

function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <div className="brands"><p>Loading brands...</p></div>;
  }

  const handleBrandClick = (brandId) => {
    navigate(`/products?brandId=${brandId}`);
  };

  return (
    <section className="brands">
      <div className="brands-header">
        <h2>Premium Brands</h2>
        <p>Explore our curated brands for every style.</p>
      </div>

      <div className="brand-grid">
        {brands.length > 0 ? (
          brands.map((brand) => (
            <button
              key={brand.id}
              className="brand-card"
              onClick={() => handleBrandClick(brand.id)}
            >
              <span className="brand-name">{brand.name}</span>
              <span className="brand-subtext">Shop the latest</span>
            </button>
          ))
        ) : (
          <p>No brands available.</p>
        )}
      </div>
    </section>
  );
}

export default Brands;