import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import api from "../../api/axios";
import "../AuthScreens.css";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);

  const isNew = !id;

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        const { data } = await api.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.imageUrl);
        setDescription(data.description);
        setCountInStock(data.countInStock);
      };
      fetchProduct();
    }
  }, [id, isNew]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const { data } = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const productData = { name, price, imageUrl: image, description, countInStock };
    try {
      if (isNew) {
        await api.post("/api/products", productData);
      } else {
        await api.put(`/api/products/${id}`, productData);
      }
      navigate("/admin/productlist");
    } catch (err) {
      alert("Failed to save product");
    }
  };

  return (
    <div className="auth-container" style={{ minHeight: "auto", padding: "2rem 0" }}>
      <div className="auth-box glass-container" style={{ maxWidth: "600px" }}>
        <Link to="/admin/productlist" className="back-link"><FaArrowLeft /> View List</Link>
        <h1>{isNew ? "Create Product" : "Edit Product"}</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          
          <div className="form-group">
            <label>Image URL / Upload</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
            <input type="file" onChange={uploadFileHandler} style={{ marginTop: "10px", background: "none", border: "none" }} />
            {uploading && <p>Uploading...</p>}
          </div>

          <div className="form-group">
            <label>Count In Stock</label>
            <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary auth-btn">Save Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditScreen;
