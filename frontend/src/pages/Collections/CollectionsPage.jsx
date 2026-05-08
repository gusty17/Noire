import "./CollectionsPage.css";
import { useState, useEffect } from "react";

import ProductCard from "../../components/ProductCard/ProductCard";
import { getProducts, getCollections } from "../../services/api";

function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsData, productsData] = await Promise.all([
          getCollections(),
          getProducts(),
        ]);
        setCollections(collectionsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group products by collection
  const getProductsByCollection = (collectionId) => {
    return products.filter((product) => product.collectionId === collectionId);
  };

  if (loading) {
    return (
      <div className="collections-page">
        <div className="loading">Loading collections...</div>
      </div>
    );
  }

  return (
    <main className="collections-page">
      <header className="collection-header">
        <h1>Collections</h1>
        <p>Discover our collections of luxury perfumes.</p>
      </header>

      <section className="collections-container">
        {collections.length > 0 ? (
          collections.map((collection) => {
            const collectionProducts = getProductsByCollection(collection.id);
            return (
              <div key={collection.id} className="collection-section">
                <h2 className="collection-title">{collection.name}</h2>
                {collection.description && (
                  <p className="collection-description">{collection.description}</p>
                )}
                <div className="products-grid">
                  {collectionProducts.length > 0 ? (
                    collectionProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        {...product}
                        onAddToCart={() => console.log("Added:", product)}
                      />
                    ))
                  ) : (
                    <p className="no-products">No products in this collection.</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-collections">No collections available.</p>
        )}
      </section>
    </main>
  );
}

export default CollectionsPage;