import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("product");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    brandId: "",
    collectionId: "",
    image: null,
  });

  // Collection form state
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    description: "",
  });

  // Brand form state
  const [brandForm, setBrandForm] = useState({
    name: "",
    description: "",
  });

  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="admin-unauthorized">
        <h2>Access Denied</h2>
        <p>You do not have permission to access the admin panel.</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price);
      formData.append("stock", productForm.stock);
      formData.append("brandId", productForm.brandId);
      formData.append("collectionId", productForm.collectionId);
      if (productForm.image) {
        formData.append("image", productForm.image);
      }

      await api.createProduct(formData);
      alert("Product created successfully!");
      setProductForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        brandId: "",
        collectionId: "",
        image: null,
      });
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      let errorMessage = "Error creating product";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error("Product creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle collection submission
  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.createCollection(collectionForm);
      alert("Collection created successfully!");
      setCollectionForm({ name: "", description: "" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error creating collection";
      setError(errorMessage);
      console.error("Collection creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle brand submission
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.createBrand(brandForm);
      alert("Brand created successfully!");
      setBrandForm({ name: "", description: "" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error creating brand";
      setError(errorMessage);
      console.error("Brand creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage products, collections, and brands</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "product" ? "active" : ""}`}
          onClick={() => setActiveTab("product")}
        >
          Add Product
        </button>
        <button
          className={`tab-btn ${activeTab === "collection" ? "active" : ""}`}
          onClick={() => setActiveTab("collection")}
        >
          Add Collection
        </button>
        <button
          className={`tab-btn ${activeTab === "brand" ? "active" : ""}`}
          onClick={() => setActiveTab("brand")}
        >
          Add Brand
        </button>
      </div>

      <div className="admin-content">
        {/* ADD PRODUCT */}
        {activeTab === "product" && (
          <div className="form-section">
            <h2>Add New Product</h2>
            {error && <div className="error-alert">{error}</div>}
            <form onSubmit={handleProductSubmit} className="admin-form">
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
                  <label>Brand ID *</label>
                  <input
                    type="number"
                    placeholder="Enter brand ID"
                    value={productForm.brandId}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        brandId: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Collection ID *</label>
                  <input
                    type="number"
                    placeholder="Enter collection ID"
                    value={productForm.collectionId}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        collectionId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image</label>
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
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Add Product"}
              </button>
            </form>
          </div>
        )}

        {/* ADD COLLECTION */}
        {activeTab === "collection" && (
          <div className="form-section">
            <h2>Add New Collection</h2>
            {error && <div className="error-alert">{error}</div>}
            <form onSubmit={handleCollectionSubmit} className="admin-form">
              <div className="form-group">
                <label>Collection Name *</label>
                <input
                  type="text"
                  placeholder="Enter collection name"
                  value={collectionForm.name}
                  onChange={(e) =>
                    setCollectionForm({
                      ...collectionForm,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter collection description"
                  value={collectionForm.description}
                  onChange={(e) =>
                    setCollectionForm({
                      ...collectionForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Add Collection"}
              </button>
            </form>
          </div>
        )}

        {/* ADD BRAND */}
        {activeTab === "brand" && (
          <div className="form-section">
            <h2>Add New Brand</h2>
            {error && <div className="error-alert">{error}</div>}
            <form onSubmit={handleBrandSubmit} className="admin-form">
              <div className="form-group">
                <label>Brand Name *</label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={brandForm.name}
                  onChange={(e) =>
                    setBrandForm({ ...brandForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter brand description"
                  value={brandForm.description}
                  onChange={(e) =>
                    setBrandForm({
                      ...brandForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Add Brand"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
