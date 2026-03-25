import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import api, { BASE_URL } from "../api/axios";
import { CartContext } from "../context/CartContext";
import "./ProductScreen.css";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    await addToCart(product, qty);
    navigate("/cart");
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="product-screen">
      <Link to="/" className="btn-secondary back-btn">
        <FaArrowLeft /> Back to Products
      </Link>

      <div className="product-details grid">
        <div className="product-image-container glass-container">
          <img 
             src={product.imageUrl?.startsWith('/') ? `${BASE_URL}${product.imageUrl}` : product.imageUrl} 
             alt={product.name} 
          />
        </div>

        <div className="product-info-container">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-price">${product.price}</div>
          <p className="product-description">{product.description}</p>
          
          <div className="product-status glass-container">
            <div className="status-row">
              <span>Price:</span>
              <strong>${product.price}</strong>
            </div>
            <div className="status-row">
              <span>Status:</span>
              <span className={product.countInStock > 0 ? "text-success" : "text-danger"}>
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="status-row">
                <span>Qty:</span>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button 
              className="btn-primary add-to-cart-btn" 
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
