import React from 'react';
import './CEHeader.css';

const CEHeader = () => {
  return (
    <header className="carbon-estimation-header">
      <div className="carbon-estimation-header-content">
        <h1 className="carbon-estimation-header-title">Track, Reduce, Neutralize</h1>
        <p className="carbon-estimation-header-subtitle">
          Calculate your carbon footprint across Scope 1, Scope 2, and AFOLU emissions. Unlock actionable insights to achieve carbon neutrality through renewable energy, reforestation, and sustainable practices.
        </p>
        <p className="carbon-estimation-header-call-to-action">
          Take the first step towards a greener future—measure your impact and discover personalized solutions today.
        </p>
      </div>
    </header>
  );
};

export default CEHeader;
