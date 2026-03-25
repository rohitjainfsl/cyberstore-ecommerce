import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import api from "../../api/axios";

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/api/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="glass-container" style={{ padding: "2rem", overflowX: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin: Product Management</h1>
        <Link to="/admin/product/create" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaPlus /> Create Product
        </Link>
      </div>

      {loading ? <h2>Loading...</h2> : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1.5rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>ID</th>
              <th style={{ padding: "1rem" }}>NAME</th>
              <th style={{ padding: "1rem" }}>PRICE</th>
              <th style={{ padding: "1rem" }}>STOCK</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={{ borderBottom: "1px solid var(--glass-border)" }}>
                <td style={{ padding: "1rem" }}>{product._id}</td>
                <td style={{ padding: "1rem" }}>{product.name}</td>
                <td style={{ padding: "1rem" }}>${product.price}</td>
                <td style={{ padding: "1rem" }}>{product.countInStock}</td>
                <td style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
                   <Link to={`/admin/product/${product._id}/edit`} className="btn-secondary" style={{ padding: "0.5rem" }}>
                      <FaEdit />
                   </Link>
                   <button onClick={() => deleteHandler(product._id)} className="btn-danger-icon">
                      <FaTrash />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductListScreen;
