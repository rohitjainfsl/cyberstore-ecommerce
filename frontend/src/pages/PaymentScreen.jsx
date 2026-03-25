import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthScreens.css";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass-container">
        <h1>Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Select Method</label>
            <div style={{ padding: "1rem 0" }}>
               <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="PayPal" 
                  checked 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: "auto", marginRight: "10px" }}
               /> 
               PayPal or Credit Card
            </div>
          </div>
          <button type="submit" className="btn-primary auth-btn">Continue</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
