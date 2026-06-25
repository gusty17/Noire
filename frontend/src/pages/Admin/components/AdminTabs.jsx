const TABS = [
  { id: "product", label: "Add Product" },
  { id: "collection", label: "Add Collection" },
  { id: "brand", label: "Add Brand" },
  { id: "featured", label: "Featured" },
  { id: "orders", label: "Orders" },
];

function AdminTabs({ activeTab, onTabChange }) {
  return (
    <div className="admin-tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default AdminTabs;
