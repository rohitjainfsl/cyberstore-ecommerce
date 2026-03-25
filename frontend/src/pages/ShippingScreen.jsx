import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthScreens.css"; // Reuse styling

const ShippingScreen = () => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem("shippingAddress", JSON.stringify({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass-container">
        <h1>Shipping</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Postal Code</label>
            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary auth-btn">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
