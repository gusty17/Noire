import { useProductForm } from "../hooks/useProductForm";

function ProductForm() {
  const {
    productForm,
    setProductForm,
    editingProductId,
    currentImageUrl,
    fileInputRef,
    brands,
    collections,
    loading,
    error,
    success,
    handleSubmit,
    handleCancelEdit,
  } = useProductForm();

  return (
    <div className="form-section">
      <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            placeholder="Enter product name"
            value={productForm.name}
            onChange={(e) =>
              setProductForm({ ...productForm, name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Enter product description"
            value={productForm.description}
            onChange={(e) =>
              setProductForm({
                ...productForm,
                description: e.target.value,
              })
            }
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price *</label>
            <input
              type="number"
              placeholder="Enter price"
              step="0.01"
              value={productForm.price}
              onChange={(e) =>
                setProductForm({ ...productForm, price: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Stock *</label>
            <input
              type="number"
              placeholder="Enter stock quantity"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm({ ...productForm, stock: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Brand *</label>
            <select
              value={productForm.brandId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  brandId: e.target.value,
                })
              }
              required
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Collection *</label>
            <select
              value={productForm.collectionId}
              onChange={(e) =>
                setProductForm({
                  ...productForm,
                  collectionId: e.target.value,
                })
              }
              required
            >
              <option value="">Select a collection</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Product Image</label>
          {currentImageUrl && editingProductId && (
            <div className="current-image-preview">
              <p style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
                Current image:
              </p>
              <img
                src={`http://localhost:5000${currentImageUrl}`}
                alt="Current product"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  borderRadius: "4px",
                  marginBottom: "12px",
                }}
              />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              setProductForm({
                ...productForm,
                image: file,
              });
            }}
          />
          {editingProductId && (
            <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              Leave empty to keep current image
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading
              ? editingProductId
                ? "Updating..."
                : "Creating..."
              : editingProductId
              ? "Update Product"
              : "Add Product"}
          </button>
          {editingProductId && (
            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
