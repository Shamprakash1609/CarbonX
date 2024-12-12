import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./VerifyOTP.css"; // New CSS file
import axios from "axios";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Get the email passed from ForgotPassword
    const { email } = location.state || {};

    if (!email) {
        navigate("/forgot-password");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5002/carbonx/v1/verify-otp",
                { email, otp }
            );
            setMessage(response.data.message);
            setError("");

            // After successful OTP verification, navigate to reset password page
            setTimeout(() => navigate("/reset-password", { state: { email } }), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid OTP.");
            setMessage("");
        }
    };

    return (
        <div className="verify-otp-container">
            <div className="verify-otp-form-container">
                <div className="verify-otp-left">
                    <h1>Verify OTP</h1>
                    <p>An OTP has been sent to your email: <b>{email}</b></p>
                    <form className="verify-otp-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="input-field"
                        />
                        {message && <div className="success-msg">{message}</div>}
                        {error && <div className="error-msg">{error}</div>}
                        <button type="submit" className="verify-btn">Verify OTP</button>
                    </form>
                </div>
                <div className="verify-otp-right">
                    <h2>Didn't receive the OTP?</h2>
                    <p>You can <a href="/forgot-password">request a new one</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
