import React from 'react';
import CEHeader from './header/CEHeader';
import EmissionCalculator from './EmissonCalculator/EmmisionCalulator';
import Footer from '../../components/footer/Footer'

const CarbonEstimation = () => {
    return (
        <div>
            <CEHeader/>
            <EmissionCalculator/>
            <Footer/>
        </div>
    );
};

export default CarbonEstimation;
