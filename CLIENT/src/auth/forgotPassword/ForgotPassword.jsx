import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"; 
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5002/carbonx/v1/forgot-password", { email });
            setMessage(response.data.message);
            setError("");

            // Navigate to Verify OTP page with email in state
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
            setMessage("");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-form-container">
                <div className="forgot-password-left">
                    <h1>Forgot Password</h1>
                    <p>Please enter your registered email below to receive an OTP.</p>
                    <form className="forgot-password-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                        {message && <div className="success-msg">{message}</div>}
                        {error && <div className="error-msg">{error}</div>}
                        <button type="submit" className="send-otp-btn">Send OTP</button>
                    </form>
                </div>
                <div className="forgot-password-right">
                    <h2>Remembered your password?</h2>
                    <p>You can <a href="/login">sign in</a> to your account!</p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
