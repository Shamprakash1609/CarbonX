import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = ({ setIsAuthenticated }) => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = "http://localhost:5002/carbonx/v1/login"; // Backend login endpoint
            const { data: res } = await axios.post(url, data);

            // Store the token and update the authentication state
            localStorage.setItem("token", res.accessToken); // Store access token
            setIsAuthenticated(true); // Update global/authentication state
            setError(""); // Clear any previous error messages

            // After login, redirect to the intended path or default to home
            const redirectPath = localStorage.getItem("redirectPath") || "/"; // Default to home if no path saved
            localStorage.removeItem("redirectPath"); // Clean up the saved path
            navigate(redirectPath); // Navigate to the intended page
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                setError(error.response.data.message); // Display error message
            }
        } finally {
            setLoading(false); // Set loading state to false after request completion
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <div className="login-left">
                    <form className="form-container" onSubmit={handleSubmit}>
                        <h1>Login to CarbonX</h1>
                        <p>Please enter your credentials to access your account.</p>
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className="input"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className="input"
                        />
                        {error && <div className="error-msg">{error}</div>}
                        <button type="submit" className="green-btn" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                        {/* Forgot Password Link */}
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </form>
                </div>
                <div className="login-right">
                    <h1>New Here?</h1>
                    <p>Create an account to join us at CarbonX!</p>
                    <Link to="/signup">
                        <button type="button"  className="white-btn">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
