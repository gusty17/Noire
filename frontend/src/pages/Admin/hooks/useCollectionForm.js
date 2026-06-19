import { useState } from "react";
import * as api from "../../../services/api";

export function useCollectionForm() {
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.createCollection(collectionForm);
      alert("Collection created successfully!");
      setCollectionForm({ name: "", description: "" });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error creating collection";
      setError(errorMessage);
      console.error("Collection creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    collectionForm,
    setCollectionForm,
    loading,
    error,
    handleSubmit,
  };
}
