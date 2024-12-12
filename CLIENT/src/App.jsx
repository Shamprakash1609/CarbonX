import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import CarbonEstimation from "./pages/carbonEstimation/CarbonEstimation";
import AfforestationOffsets from "./pages/afforestationOffsets/AfforestationOffsets";
import CarbonCredits from "./pages/carbonCredits/CarbonCredits";
import Blogs from "./pages/blogs/Blogs";
import Login from "./auth/login/Login";
import Signup from "./auth/signup/Signup";
import ForgotPassword from "./auth/forgotPassword/ForgotPassword";
import VerifyOTP from "./auth/verifyOtp/VerifyOtp";
import ResetPassword from "./auth/resetPassword/ResetPassword";
import Navbar from "./components/navbar/Navbar";
import axios from "axios";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:5002/carbonx/v1/verify-token", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Error verifying token:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const noNavbarRoutes = ["/login", "/signup", "/forgot-password", "/verify-otp", "/reset-password"];
    const showNavbar = !noNavbarRoutes.includes(location.pathname);

    return (
        <>
            {showNavbar && (
                <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            )}
            <Routes>
                {/* Public Pages */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/carbon-estimation" element={<CarbonEstimation />} />
                <Route path="/blogs" element={<Blogs />} />

                {/* Protected Pages */}
                <Route
                    path="/afforestation-offsets"
                    element={
                        isAuthenticated ? (
                            <AfforestationOffsets />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/carbon-credits"
                    element={
                        isAuthenticated ? (
                            <CarbonCredits />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Authentication Pages */}
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/signup" element={<Signup />} />

                {/* Forgot Password Flow */}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
