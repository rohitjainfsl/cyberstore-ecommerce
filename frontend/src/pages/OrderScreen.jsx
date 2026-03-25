import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api, { BASE_URL } from "../api/axios";
import "./CartScreen.css";

const OrderScreen = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <h2>Loading Order...</h2>;
  if (!order) return <h2>Order not found.</h2>;

  return (
    <div>
      <h1>Order #{order._id}</h1>
      <div className="cart-grid">
         <div className="cart-items">
            <div className="glass-container" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
              <h2>Shipping Details</h2>
              <p>ID: {order.user._id} | Name: {order.user.name}</p>
              <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <div className={order.isDelivered ? "text-success" : "text-danger"}>
                {order.isDelivered ? `Delivered at ${order.deliveredAt}` : "Not Delivered"}
              </div>
            </div>

            <div className="glass-container" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
              <h2>Payment Method</h2>
              <p>Method: {order.paymentMethod}</p>
              <div className={order.isPaid ? "text-success" : "text-danger"}>
                {order.isPaid ? `Paid on ${order.paidAt}` : "Not Paid"}
              </div>
            </div>

            <div className="glass-container" style={{ padding: "1.5rem" }}>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--glass-border)" }}>
                  <span>{item.name} x {item.qty}</span>
                  <span>${(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
         </div>

         <div className="cart-summary glass-container">
            <h2>Totals</h2>
            <div className="status-row"><span>Items:</span> <span>${order.itemsPrice.toFixed(2)}</span></div>
            <div className="status-row"><span>Shipping:</span> <span>${order.shippingPrice.toFixed(2)}</span></div>
            <div className="status-row"><span>Tax:</span> <span>${order.taxPrice.toFixed(2)}</span></div>
            <div className="summary-total">${order.totalPrice.toFixed(2)}</div>
         </div>
      </div>
    </div>
  );
};

export default OrderScreen;
