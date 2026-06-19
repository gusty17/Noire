import { useBrandForm } from "../hooks/useBrandForm";

function BrandForm() {
  const { brandForm, setBrandForm, loading, error, handleSubmit } = useBrandForm();

  return (
    <div className="form-section">
      <h2>Add New Brand</h2>
      {error && <div className="error-alert">{error}</div>}
      <form onSubmit={handleSubmit} className="admin-form">
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Add Brand"}
        </button>
      </form>
    </div>
  );
}

export default BrandForm;
