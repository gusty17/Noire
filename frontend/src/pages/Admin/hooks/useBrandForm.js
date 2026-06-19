import { useState } from "react";
import * as api from "../../../services/api";

export function useBrandForm() {
  const [brandForm, setBrandForm] = useState({
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
      await api.createBrand(brandForm);
      alert("Brand created successfully!");
      setBrandForm({ name: "", description: "" });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error creating brand";
      setError(errorMessage);
      console.error("Brand creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    brandForm,
    setBrandForm,
    loading,
    error,
    handleSubmit,
  };
}
