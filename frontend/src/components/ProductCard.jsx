import { Link } from "react-router-dom";
import { BASE_URL } from "../api/axios";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card glass-container">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.imageUrl?.startsWith('/') ? `${BASE_URL}${product.imageUrl}` : product.imageUrl} 
          alt={product.name} 
          className="product-image" 
        />
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-price">${product.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;
