import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("product");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [brands, setBrands] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

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

  // Handle query parameters for edit/delete
  useEffect(() => {
    const editProductId = searchParams.get("editProduct");
    const deleteProductId = searchParams.get("deleteProduct");

    if (editProductId) {
      setActiveTab("product");
      setEditingProductId(editProductId);
      fetchProductForEdit(editProductId);
    }

    if (deleteProductId) {
      handleDeleteProduct(deleteProductId);
    }
  }, [searchParams]);

  // Fetch brands and collections on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [brandsData, collectionsData] = await Promise.all([
          api.getBrands(),
          api.getCollections(),
        ]);
        setBrands(brandsData);
        setCollections(collectionsData);
      } catch (err) {
        console.error("Error fetching brands and collections:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Fetch all orders when Orders tab is active
  useEffect(() => {
    if (activeTab === "orders") {
      fetchAllOrders();
    }
  }, [activeTab]);

  const fetchAllOrders = async () => {
    try {
      setLoadingOrders(true);
      const ordersData = await api.getAllOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch product data for editing
  const fetchProductForEdit = async (id) => {
    try {
      const product = await api.getProductById(id);
      setProductForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        brandId: product.brandId || "",
        collectionId: product.collectionId || "",
        image: null,
      });
      setCurrentImageUrl(product.imageUrl);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product for editing");
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      setSuccess("Product deleted successfully!");
      setError("");
      setTimeout(() => {
        setSuccess("");
        setSearchParams({});
        navigate("/");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Error deleting product";
      setError(errorMessage);
      console.error("Product deletion error:", err);
      setTimeout(() => {
        setSearchParams({});
      }, 2000);
    }
  };

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

  // Handle product submission (create or update)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

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

      if (editingProductId) {
        // Update existing product
        await api.updateProduct(editingProductId, formData);
        setSuccess("Product updated successfully!");
        setTimeout(() => {
          setSuccess("");
          setEditingProductId(null);
          setSearchParams({});
          setProductForm({
            name: "",
            description: "",
            price: "",
            stock: "",
            brandId: "",
            collectionId: "",
            image: null,
          });
          setCurrentImageUrl(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          navigate("/");
        }, 2000);
      } else {
        // Create new product
        await api.createProduct(formData);
        setSuccess("Product created successfully!");
        setTimeout(() => {
          setSuccess("");
          setProductForm({
            name: "",
            description: "",
            price: "",
            stock: "",
            brandId: "",
            collectionId: "",
            image: null,
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 2000);
      }
    } catch (error) {
      let errorMessage = "Error saving product";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      console.error("Product save error:", error);
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
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      <div className="admin-content">
        {/* ADD PRODUCT */}
        {activeTab === "product" && (
          <div className="form-section">
            <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
            {error && <div className="error-alert">{error}</div>}
            {success && <div className="success-alert">{success}</div>}
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
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (editingProductId ? "Updating..." : "Creating...") : (editingProductId ? "Update Product" : "Add Product")}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditingProductId(null);
                      setCurrentImageUrl(null);
                      setSearchParams({});
                      setProductForm({
                        name: "",
                        description: "",
                        price: "",
                        stock: "",
                        brandId: "",
                        collectionId: "",
                        image: null,
                      });
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
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

        {/* ALL ORDERS */}
        {activeTab === "orders" && (
          <div className="form-section">
            <h2>All Orders</h2>
            {error && <div className="error-alert">{error}</div>}
            {loadingOrders ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Email</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.userEmail}</td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="items-info">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="item-row">
                                {item.productName} x {item.quantity}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
