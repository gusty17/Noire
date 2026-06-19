import { useOrders } from "../hooks/useOrders";
import OrderDetailsModal from "./OrderDetailsModal";

function OrdersTable() {
  const {
    orders,
    loadingOrders,
    updatingOrderStatus,
    selectedOrder,
    error,
    success,
    handleStatusChange,
    handleOrderClick,
    closeOrderDetails,
  } = useOrders();

  return (
    <div className="form-section">
      <h2>All Orders</h2>
      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <button
                      className="order-id-link"
                      onClick={() => handleOrderClick(order)}
                    >
                      #{order.id}
                    </button>
                  </td>
                  <td>{order.userEmail}</td>
                  <td>{order.totalPrice.toFixed(2)} LE</td>
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
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updatingOrderStatus === order.id}
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeOrderDetails} />
      )}
    </div>
  );
}

export default OrdersTable;
