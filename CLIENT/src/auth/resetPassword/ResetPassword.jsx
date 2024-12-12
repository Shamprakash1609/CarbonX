import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResetPassword.css";
import axios from "axios";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5002/carbonx/v1/reset-password", {
                email,
                newPassword,
            });
            setMessage(response.data.message);
            setError("");
            setTimeout(() => navigate("/login"), 2000); // Redirect to login
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password.");
            setMessage("");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-form-container">
                <div className="reset-password-left">
                    <h1>Reset Password</h1>
                    <form className="reset-password-form" onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                        {message && <div className="success-msg">{message}</div>}
                        {error && <div className="error-msg">{error}</div>}
                        <button type="submit" className="reset-btn">Reset Password</button>
                    </form>
                </div>
                <div className="reset-password-right">
                    <h2>Need to log in?</h2>
                    <p>You can go back to the <a href="/login">login page</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
