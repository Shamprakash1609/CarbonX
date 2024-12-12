import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const heroSectionHeight = document.querySelector(".hero-section")?.offsetHeight || 50;
            if (window.scrollY > heroSectionHeight) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleProtectedNavigation = (path) => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate(path);
        } else {
            localStorage.setItem("redirectPath", path); // Store intended path
            navigate("/login");
        }
    };

    const handleAfforestationOffsets = () => {
        const firstVisitKey = "visitedGISPage";
    
        if (!localStorage.getItem(firstVisitKey)) {
            // If the user is visiting for the first time, redirect to GIS.html
            localStorage.setItem(firstVisitKey, "true"); // Mark as visited
            window.open("/GIS/GIS.html", "_blank");
        } else {
            // On subsequent visits, trigger the protected navigation
            handleProtectedNavigation("/afforestation-offsets");
        }
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        setIsAuthenticated(false); // Update authentication state
        navigate("/login");
    };

    return (
        <header className={`header ${isSticky ? "sticky" : ""}`}>
            <div className="container">
                <div className="logo">CarbonX</div>
                <nav className="navbar">
                    <ul className="nav-menu">
                        <li className={location.pathname === "/" ? "active" : ""}>
                            <Link to="/">Home</Link>
                        </li>
                        <li className={location.pathname === "/carbon-estimation" ? "active" : ""}>
                            <Link to="/carbon-estimation">Carbon Estimation</Link>
                        </li>
                        {/* <li
                            className={location.pathname === "/afforestation-offsets" ? "active" : ""}
                            onClick={() => handleProtectedNavigation("/afforestation-offsets")}
                        > */}
                        {/* <li
    
    onClick={() => window.open("./GIS/GIS.html", "_blank")}
> */}
<li
    onClick={handleAfforestationOffsets}
>
                            Afforestation Offsets
                        </li>
                        <li
                            className={location.pathname === "/carbon-credits" ? "active" : ""}
                            onClick={() => handleProtectedNavigation("/carbon-credits")}
                        >
                            Carbon Credits
                        </li>
                        <li className={location.pathname === "/blogs" ? "active" : ""}>
                            <Link to="/blogs">Blogs</Link>
                        </li>
                    </ul>
                    <div className="auth-buttons">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/signup" className="btn btn-signup">Sign Up</Link>
                                <Link to="/login" className="btn btn-login">Login</Link>
                            </>
                        ) : (
                            <button
                                className="btn btn-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
