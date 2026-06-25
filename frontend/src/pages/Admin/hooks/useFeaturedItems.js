import { useEffect, useState } from "react";
import * as api from "../../../services/api";

const MAX_FEATURED = 4;

export function useFeaturedItems() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [productsData, collectionsData, brandsData] = await Promise.all([
          api.getProducts(),
          api.getCollections(),
          api.getBrands(),
        ]);
        setProducts(productsData);
        setCollections(collectionsData);
        setBrands(brandsData);
      } catch (err) {
        console.error("Error fetching items for featured management:", err);
        setError("Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const featuredCount = (items) => items.filter((item) => item.isFeatured).length;

  const toggleFeatured = async (type, id, nextValue) => {
    const config = {
      product: { items: products, setItems: setProducts, request: api.setProductFeatured },
      collection: { items: collections, setItems: setCollections, request: api.setCollectionFeatured },
      brand: { items: brands, setItems: setBrands, request: api.setBrandFeatured },
    }[type];

    if (nextValue && featuredCount(config.items) >= MAX_FEATURED) {
      setError(`You can only feature up to ${MAX_FEATURED} ${type}s at a time — unfeature one first.`);
      return;
    }

    setError("");
    setUpdatingId(id);
    try {
      await config.request(id, nextValue);
      config.setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isFeatured: nextValue } : item))
      );
    } catch (err) {
      console.error(`Error updating featured status for ${type} ${id}:`, err);
      setError("Failed to update featured status");
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    products,
    collections,
    brands,
    loading,
    error,
    updatingId,
    maxFeatured: MAX_FEATURED,
    productsFeaturedCount: featuredCount(products),
    collectionsFeaturedCount: featuredCount(collections),
    brandsFeaturedCount: featuredCount(brands),
    toggleFeatured,
  };
}
