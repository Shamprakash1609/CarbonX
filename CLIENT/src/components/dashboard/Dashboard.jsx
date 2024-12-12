import React from 'react';
import Navbar from '../navbar/Navbar';
import HeroSection from './dashComponents/heroSection/HeroSection';
import KVP from './dashComponents/kvp/KVP';
import InsightsDashboard from './dashComponents/insightsDashboard/InsightsDash';
import Footer from '../footer/Footer';
import Chatbot from './dashComponents/chatbox/Chatbot';

const Dashboard = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <KVP />
            <InsightsDashboard />
            <Footer />
            <Chatbot />
        </div>
    );
};

export default Dashboard;
