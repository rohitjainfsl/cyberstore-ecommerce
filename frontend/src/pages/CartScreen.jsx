import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../api/axios";
import "./CartScreen.css";

const CartScreen = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  const checkoutHandler = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=/shipping");
    }
  };

  return (
    <div className="cart-screen">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart glass-container">
          <FaShoppingCart className="empty-icon" />
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-primary">Go Shopping</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = item.product._id || item.product;
              const name = item.name || (item.product && item.product.name);
              const price = item.price || (item.product && item.product.price);
              const image = item.image || (item.product && (item.product.imageUrl || item.product.image));
              const qty = item.quantity || item.qty;

              return (
                <div key={product} className="cart-item glass-container">
                  <div className="cart-item-image">
                    <img 
                      src={image?.startsWith('/') ? `${BASE_URL}${image}` : image} 
                      alt={name} 
                    />
                  </div>
                  <div className="cart-item-details">
                    <Link to={`/product/${product}`}>{name}</Link>
                    <div className="cart-item-price">${price}</div>
                  </div>
                  <div className="cart-item-qty">
                     Qty: {qty}
                  </div>
                  <div className="cart-item-actions">
                    <button onClick={() => removeFromCart(product)} className="btn-danger-icon">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
            <Link to="/" className="back-link">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </div>

          <div className="cart-summary glass-container">
            <h3>Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.quantity || item.qty || 0), 0)}) items</h3>
            <div className="summary-total">
              ${cartItems.reduce((acc, item) => {
                const price = item.price || (item.product && item.product.price) || 0;
                const qty = item.quantity || item.qty || 0;
                return acc + (qty * price);
              }, 0).toFixed(2)}
            </div>
            <button 
              className="btn-primary checkout-btn" 
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
