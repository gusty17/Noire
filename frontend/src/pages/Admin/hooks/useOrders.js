import { useEffect, useState } from "react";
import * as api from "../../../services/api";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
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

    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderStatus(orderId);
      await api.updateOrderStatus(orderId, newStatus);

      // Update the order status in the local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setSuccess("Order status updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdatingOrderStatus(null);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return {
    orders,
    loadingOrders,
    updatingOrderStatus,
    selectedOrder,
    error,
    success,
    handleStatusChange,
    handleOrderClick,
    closeOrderDetails,
  };
}
