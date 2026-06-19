import { useCollectionForm } from "../hooks/useCollectionForm";

function CollectionForm() {
  const { collectionForm, setCollectionForm, loading, error, handleSubmit } =
    useCollectionForm();

  return (
    <div className="form-section">
      <h2>Add New Collection</h2>
      {error && <div className="error-alert">{error}</div>}
      <form onSubmit={handleSubmit} className="admin-form">
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

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Add Collection"}
        </button>
      </form>
    </div>
  );
}

export default CollectionForm;
