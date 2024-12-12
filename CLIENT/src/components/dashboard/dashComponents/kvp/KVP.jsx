import React from 'react';
import './KVP.css';
import factIcon from '../../../../assets/images/fact.png';
import dataIcon from '../../../../assets/images/data.png';
import pinIcon from '../../../../assets/images/pin.png';

const KVP = () => {
    return (
        <section className="key-value-propositions">
            <div className="container">
                <h2 className="section-title">Why Choose CarbonX?</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="icon">
                            <img src={factIcon} alt="Emission Tracking Icon" />
                        </div>
                        <h3>Emission Tracking</h3>
                        <p>Quantify emissions from coal mining activities to develop reduction strategies.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">
                            <img src={dataIcon} alt="AI-powered Insights Icon" />
                        </div>
                        <h3>AI-powered Insights</h3>
                        <p>Harness the power of AI to simulate and analyze emission reduction pathways.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon">
                            <img src={pinIcon} alt="Carbon Credits Icon" />
                        </div>
                        <h3>Carbon Credits</h3>
                        <p>Earn carbon credits by offsetting emissions with afforestation projects.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default KVP;
