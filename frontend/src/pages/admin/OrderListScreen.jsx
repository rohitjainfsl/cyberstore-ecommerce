import { useState, useEffect } from "react";
import api from "../../api/axios";

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="glass-container" style={{ padding: "2rem", overflowX: "auto" }}>
      <h1>Admin: All Orders</h1>
      {loading ? <h2>Loading...</h2> : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1.5rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>ID</th>
              <th style={{ padding: "1rem" }}>USER</th>
              <th style={{ padding: "1rem" }}>DATE</th>
              <th style={{ padding: "1rem" }}>TOTAL</th>
              <th style={{ padding: "1rem" }}>PAID</th>
              <th style={{ padding: "1rem" }}>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ padding: "1rem" }}>{order._id}</td>
                <td style={{ padding: "1rem" }}>{order.user && order.user.name}</td>
                <td style={{ padding: "1rem" }}>{order.createdAt.substring(0, 10)}</td>
                <td style={{ padding: "1rem" }}>${order.totalPrice}</td>
                <td style={{ padding: "1rem" }}>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td style={{ padding: "1rem" }}>{order.isDelivered ? order.deliveredAt.substring(0, 10) : "No"}</td>
                <td style={{ padding: "1rem" }}>
                   <button 
                     onClick={() => window.location.href = `/order/${order._id}`}
                     className="btn-secondary"
                     style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                   >Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderListScreen;
