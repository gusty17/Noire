import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminTabs from "./components/AdminTabs";
import ProductForm from "./components/ProductForm";
import CollectionForm from "./components/CollectionForm";
import BrandForm from "./components/BrandForm";
import OrdersTable from "./components/OrdersTable";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("product");

  // Edit/delete product links always land on the Product tab. Adjusted
  // during render (React's recommended pattern) instead of in an effect,
  // so it takes effect on the same render and doesn't cause a render loop.
  const deepLinkId = searchParams.get("editProduct") || searchParams.get("deleteProduct");
  const [lastDeepLinkId, setLastDeepLinkId] = useState(null);
  if (deepLinkId && deepLinkId !== lastDeepLinkId) {
    setLastDeepLinkId(deepLinkId);
    setActiveTab("product");
  }

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

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage products, collections, and brands</p>
      </div>

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="admin-content">
        {activeTab === "product" && <ProductForm />}
        {activeTab === "collection" && <CollectionForm />}
        {activeTab === "brand" && <BrandForm />}
        {activeTab === "orders" && <OrdersTable />}
      </div>
    </div>
  );
}

export default Admin;
