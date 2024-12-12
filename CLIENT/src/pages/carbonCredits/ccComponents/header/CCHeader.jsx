import React from "react";
import "./CCHeader.css";

const CCHeader = () => {
  return (
    <header className="carbon-credits-header">
      <div className="header-content">
        <h1 className="header-title">Carbon Credits</h1>
        <p className="header-subtitle">
          Calculate your carbon credits and explore strategies to reduce emissions and earn rewards.
        </p>
        <button className="cta-button">Get Started</button>
      </div>
    </header>
  );
};

export default CCHeader;
