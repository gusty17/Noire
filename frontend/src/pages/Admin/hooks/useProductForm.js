import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as api from "../../../services/api";

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  brandId: "",
  collectionId: "",
  image: null,
};

export function useProductForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [brands, setBrands] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Handle query parameters for edit/delete
  useEffect(() => {
    const editProductId = searchParams.get("editProduct");
    const deleteProductId = searchParams.get("deleteProduct");

    if (editProductId) {
      setEditingProductId(editProductId);
      fetchProductForEdit(editProductId);
    }

    if (deleteProductId) {
      handleDeleteProduct(deleteProductId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const resetForm = () => {
    setProductForm(emptyProductForm);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setCurrentImageUrl(null);
    setSearchParams({});
    resetForm();
  };

  // Handle product submission (create or update)
  const handleSubmit = async (e) => {
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
          resetForm();
          setCurrentImageUrl(null);
          navigate("/");
        }, 2000);
      } else {
        // Create new product
        await api.createProduct(formData);
        setSuccess("Product created successfully!");
        setTimeout(() => {
          setSuccess("");
          resetForm();
        }, 2000);
      }
    } catch (err) {
      let errorMessage = "Error saving product";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Product save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    productForm,
    setProductForm,
    editingProductId,
    currentImageUrl,
    fileInputRef,
    brands,
    collections,
    loadingData,
    loading,
    error,
    success,
    handleSubmit,
    handleCancelEdit,
  };
}
