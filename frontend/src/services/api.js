import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Attach JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


//  AUTH

export const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const register = async (fullName, email, password) => {
  const response = await apiClient.post("/auth/register", {
    fullName,
    email,
    password,
  });

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};


// PRODUCTS

export const getProducts = async () => {
  const response = await apiClient.get("/product");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/product/${id}`);
  return response.data;
};


//  CART


export const getCart = async () => {
  const response = await apiClient.get("/cart");
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await apiClient.post("/cart", {
    productId,
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (productId) => {
  await apiClient.delete(`/cart/product/${productId}`);
};

export const clearCart = async () => {
  await apiClient.delete("/cart/clear");
};


//  ORDERS


export const createOrder = async () => {
  const response = await apiClient.post("/order");
  return response.data;
};

export const getOrders = async () => {
  const response = await apiClient.get("/order");
  return response.data;
};


// COLLECTIONS


export const getCollections = async () => {
  const response = await apiClient.get("/collection");
  return response.data;
};

export const getCollectionById = async (id) => {
  const response = await apiClient.get(`/collection/${id}`);
  return response.data;
};

export const createCollection = async (data) => {
  const response = await apiClient.post("/collection", data);
  return response.data;
};

export const updateCollection = async (id, data) => {
  const response = await apiClient.put(`/collection/${id}`, data);
  return response.data;
};

export const deleteCollection = async (id) => {
  await apiClient.delete(`/collection/${id}`);
};


//  BRANDS


export const getBrands = async () => {
  const response = await apiClient.get("/brand");
  return response.data;
};

export const createBrand = async (data) => {
  const response = await apiClient.post("/brand", data);
  return response.data;
};

export const updateBrand = async (id, data) => {
  const response = await apiClient.put(`/brand/${id}`, data);
  return response.data;
};

export const deleteBrand = async (id) => {
  await apiClient.delete(`/brand/${id}`);
};


//  ADMIN 

export const createProduct = async (formData) => {
  const response = await apiClient.post("/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await apiClient.put(`/product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  await apiClient.delete(`/product/${id}`);
};

export default apiClient;