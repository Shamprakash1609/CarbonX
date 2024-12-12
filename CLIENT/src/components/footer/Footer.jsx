import React from 'react';
import './Footer.css'; 
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa'; 
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-section company-info">
                    <h3>About CarbonX</h3>
                    <p>CarbonX is committed to empowering industries with innovative solutions to monitor and reduce their carbon footprint. Our mission is to promote environmental sustainability through cutting-edge technology and data-driven insights.</p>
                </div>

                <div className="footer-section quick-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Afforestation Offsets</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div className="footer-section legal-links">
                    <h3>Legal Links</h3>
                    <ul>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </div>

                <div className="footer-section social-media">
                    <h3>Follow Us</h3>
                    <ul>
                        <li><a href="#"><FaFacebookF /> Facebook</a></li>
                        <li><a href="#"><FaLinkedinIn /> LinkedIn</a></li>
                        <li><a href="#"><FaXTwitter /> Twitter</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 CarbonX. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
