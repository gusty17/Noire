import "./Products.css";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts, searchProducts, getProductsByBrand, getProductsByCollection, getBrands, getCollections } from "../../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState(null); // "brand" or "collection"
  const [filterName, setFilterName] = useState(""); // Display name of the filter
  const [brands, setBrands] = useState({});
  const [collections, setCollections] = useState({});

  // Load brands and collections for name mapping
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [brandsData, collectionsData] = await Promise.all([getBrands(), getCollections()]);
        const brandsMap = {};
        const collectionsMap = {};
        brandsData.forEach(brand => { brandsMap[brand.id] = brand.name; });
        collectionsData.forEach(col => { collectionsMap[col.id] = col.name; });
        setBrands(brandsMap);
        setCollections(collectionsMap);
      } catch (err) {
        console.error("Error loading metadata:", err);
      }
    };
    loadMetadata();
  }, []);

  // Initialize search and filters from URL params
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlBrandId = searchParams.get("brandId");
    const urlCollectionId = searchParams.get("collectionId");

    if (urlSearch) {
      setSearchQuery(urlSearch);
      setFilterType(null);
    } else if (urlBrandId) {
      setFilterType("brand");
      setFilterName(brands[urlBrandId] || `Brand ${urlBrandId}`);
    } else if (urlCollectionId) {
      setFilterType("collection");
      setFilterName(collections[urlCollectionId] || `Collection ${urlCollectionId}`);
    }
  }, [searchParams, brands, collections]);

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
        const brandId = searchParams.get("brandId");
        const collectionId = searchParams.get("collectionId");

        let data;
        if (debouncedQuery) {
          data = await searchProducts(debouncedQuery);
        } else if (brandId) {
          data = await getProductsByBrand(brandId);
        } else if (collectionId) {
          data = await getProductsByCollection(collectionId);
        } else {
          data = await getProducts();
        }
        
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
  }, [debouncedQuery, searchParams]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilter = () => {
    navigate("/products");
    setFilterType(null);
    setFilterName("");
    setSearchQuery("");
  };

  if (error) {
    return (
      <main className="products-page">
        <header className="products-header">
          <h1>Products</h1>
          {filterType && (
            <div className="active-filter">
              <p>Showing {filterType === "brand" ? "Brand" : "Collection"}: <strong>{filterName}</strong></p>
              <button className="clear-filter-btn" onClick={clearFilter}>Clear Filter</button>
            </div>
          )}
          <p className="error-message">{error}</p>
        </header>
      </main>
    );
  }

  return (
    <main className="products-page">
      <header className="products-header">
        <div className="header-content">
          <h1>Our Products</h1>
          {filterType && (
            <div className="active-filter">
              <p>Showing {filterType === "brand" ? "Brand" : "Collection"}: <strong>{filterName}</strong></p>
            </div>
          )}
          <p>Browse our premium fragrances</p>
        </div>
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
            <p className="no-products">No products found{searchQuery ? ` for "${searchQuery}"` : filterType ? ` in this ${filterType}` : ""}.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default Products;
