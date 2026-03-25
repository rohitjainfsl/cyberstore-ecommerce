import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header glass-container">
      <div className="container header-container">
        <Link to="/" className="brand">
          Cyber<span className="brand-accent">Store</span>
        </Link>
        <nav className="nav-links">
          <Link to="/cart" className="nav-link">
            <FaShoppingCart /> 
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="badge">
                {cartItems.reduce((a, c) => a + (Number(c.quantity) || 0), 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div className="dropdown">
              <span className="nav-link">
                <FaUser /> {userInfo.name}
              </span>
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              <FaUser /> Sign In
            </Link>
          )}

          {userInfo && userInfo.role === "admin" && (
            <div className="dropdown admin-dropdown">
              <span className="nav-link admin-link">Admin</span>
              <div className="dropdown-menu">
                <Link to="/admin/productlist">Products</Link>
                <Link to="/admin/orderlist">Orders</Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
