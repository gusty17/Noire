function OrderDetailsModal({ order, onClose }) {
  return (
    <div className="order-details-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Order Details - #{order.id}</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>

        <div className="order-info">
          <div className="info-section">
            <h4>Customer Information</h4>
            <p><strong>Email:</strong> {order.userEmail}</p>
            <p><strong>Phone Number:</strong> {order.phoneNumber || 'Not provided'}</p>
            <p><strong>Address:</strong> {order.address || 'Not provided'}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong>
              <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                {order.status}
              </span>
            </p>
          </div>

          <div className="info-section">
            <h4>Order Summary</h4>
            <div className="order-items">
              {order.items?.map((item, idx) => (
                <div key={idx} className="order-item">
                  <div className="item-details">
                    <span className="item-name">{item.productName}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">{item.price.toFixed(2)} LE</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: {order.totalPrice.toFixed(2)} LE</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;
