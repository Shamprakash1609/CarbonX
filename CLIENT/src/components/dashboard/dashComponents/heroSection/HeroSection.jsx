import React from 'react';
import './HeroSection.css';
import videoBackground from '../../../../assets/video1.mp4';

const HeroSection = () => {
    return (
        <header className="hero-section">
            <div className="hero-content">
                <h1 className="hero-heading">Leading the Path to Carbon Neutrality for Indian Coal Mines</h1>
                <p className="hero-subheading">Empowering the coal industry to track, reduce, and offset emissions with AI-powered insights.</p>
                <div className="cta-buttons">
                    <a href="#get-started" className="cta-btn btn-primary">Get Started Now</a>
                    <a href="#explore" className="cta-btn btn-secondary">Explore Our Solutions</a>
                </div>
            </div>
            <div className="video-background">
        <video autoPlay muted loop playsInline>
            <source src={videoBackground} type="video/mp4" />
        </video>
            </div>
        </header>
    );
}

export default HeroSection;
