import React from 'react';
import './InsightsDash.css'; 

const InsightsDashboard = () => {
    return (
        <section className="insights-dashboard">
            <div className="container">
                <div className="dashboard-card">
                    <h2 className="section-title">CarbonX Insights Dashboard</h2>

                    {/* Statistics Overview */}
                    <div className="dashboard-stats">
                        <div className="stat-box">
                            <h3>Current Emissions</h3>
                            <p>
                                <span className="stat-number">15,000</span> tons
                            </p>
                            <div className="stat-bar">
                                <div
                                    className="stat-fill"
                                    style={{ width: '75%' }}
                                ></div>
                            </div>
                            <p>Tracked for September</p>
                        </div>

                        <div className="stat-box">
                            <h3>Carbon Credits Earned</h3>
                            <p>
                                <span className="stat-number">3,500</span> credits
                            </p>
                            <div className="stat-bar">
                                <div
                                    className="stat-fill"
                                    style={{ width: '60%' }}
                                ></div>
                            </div>
                            <p>Offset Target Achieved</p>
                        </div>

                        <div className="stat-box">
                            <h3>AI Emission Forecast</h3>
                            <p>
                                <span className="stat-number">12%</span> Reduction
                            </p>
                            <div className="stat-bar">
                                <div
                                    className="stat-fill"
                                    style={{ width: '40%' }}
                                ></div>
                            </div>
                            <p>Predicted for Q4 2024</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InsightsDashboard;
