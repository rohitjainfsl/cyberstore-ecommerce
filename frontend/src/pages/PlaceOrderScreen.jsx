import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../api/axios";
import "./CartScreen.css"; // Reuse grid stylings

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);

  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
  const paymentMethod = JSON.parse(localStorage.getItem("paymentMethod") || '"PayPal"');

  const itemsPrice = cartItems.reduce((acc, item) => {
    const price = item.price || (item.product && item.product.price) || 0;
    const qty = item.quantity || item.qty || 0;
    return acc + price * qty;
  }, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [paymentMethod, shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      // Map items to match backend Order model (name, qty, image, price, product)
      const orderItems = cartItems.map(item => ({
        name: item.name || item.product.name,
        qty: item.quantity || item.qty, // Support both quantity and qty
        image: item.image || item.product.imageUrl || item.product.image,
        price: item.price || item.product.price,
        product: item.product._id || item.product // Support both populated and ID
      }));

      const { data } = await api.post("/api/orders", {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Order placement failed");
    }
  };

  return (
    <div className="place-order-screen">
      <h1>Checkout Summary</h1>
      <div className="cart-grid">
        <div className="cart-items">
          <div className="glass-container" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
            <h2>Shipping</h2>
            <p>{shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}</p>
          </div>
          <div className="glass-container" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
            <h2>Payment</h2>
            <p>Method: {paymentMethod}</p>
          </div>
          <div className="glass-container" style={{ padding: "1.5rem" }}>
            <h2>Order Items</h2>
            {cartItems.map((item, index) => {
              const name = item.name || (item.product && item.product.name);
              const price = item.price || (item.product && item.product.price);
              const qty = item.quantity || item.qty;
              return (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--glass-border)" }}>
                  <span>{name} x {qty}</span>
                  <span>${(qty * price).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cart-summary glass-container">
          <h2>Order Summary</h2>
          <div className="status-row"><span>Items:</span> <span>${itemsPrice.toFixed(2)}</span></div>
          <div className="status-row"><span>Shipping:</span> <span>${shippingPrice.toFixed(2)}</span></div>
          <div className="status-row"><span>Tax:</span> <span>${taxPrice.toFixed(2)}</span></div>
          <div className="summary-total">Total: ${totalPrice.toFixed(2)}</div>
          <button className="btn-primary checkout-btn" onClick={placeOrderHandler}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
