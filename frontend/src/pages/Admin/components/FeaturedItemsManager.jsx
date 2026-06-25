import { useFeaturedItems } from "../hooks/useFeaturedItems";

function FeaturedList({ title, items, featuredCount, maxFeatured, updatingId, onToggle }) {
  return (
    <div className="featured-list">
      <h3>
        {title}{" "}
        <span className="featured-count">
          ({featuredCount}/{maxFeatured} featured)
        </span>
      </h3>
      {items.length === 0 ? (
        <p>No {title.toLowerCase()} yet.</p>
      ) : (
        <ul className="featured-checklist">
          {items.map((item) => {
            const atCap = featuredCount >= maxFeatured && !item.isFeatured;
            return (
              <li key={item.id}>
                <label className={atCap ? "disabled" : ""}>
                  <input
                    type="checkbox"
                    checked={item.isFeatured}
                    disabled={updatingId === item.id || atCap}
                    onChange={(e) => onToggle(item.id, e.target.checked)}
                  />
                  {item.name}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function FeaturedItemsManager() {
  const {
    products,
    collections,
    brands,
    loading,
    error,
    updatingId,
    maxFeatured,
    productsFeaturedCount,
    collectionsFeaturedCount,
    brandsFeaturedCount,
    toggleFeatured,
  } = useFeaturedItems();

  if (loading) {
    return (
      <div className="form-section">
        <p>Loading items...</p>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h2>Featured on Homepage</h2>
      <p className="featured-help">
        Choose up to {maxFeatured} of each to show on the homepage. If fewer than {maxFeatured} are
        chosen, the homepage automatically fills the rest.
      </p>
      {error && <div className="error-alert">{error}</div>}

      <div className="featured-columns">
        <FeaturedList
          title="Products"
          items={products}
          featuredCount={productsFeaturedCount}
          maxFeatured={maxFeatured}
          updatingId={updatingId}
          onToggle={(id, value) => toggleFeatured("product", id, value)}
        />
        <FeaturedList
          title="Collections"
          items={collections}
          featuredCount={collectionsFeaturedCount}
          maxFeatured={maxFeatured}
          updatingId={updatingId}
          onToggle={(id, value) => toggleFeatured("collection", id, value)}
        />
        <FeaturedList
          title="Brands"
          items={brands}
          featuredCount={brandsFeaturedCount}
          maxFeatured={maxFeatured}
          updatingId={updatingId}
          onToggle={(id, value) => toggleFeatured("brand", id, value)}
        />
      </div>
    </div>
  );
}

export default FeaturedItemsManager;
