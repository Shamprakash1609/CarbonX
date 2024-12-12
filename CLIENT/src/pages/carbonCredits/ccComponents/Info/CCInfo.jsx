import React from "react";
import "./CCInfo.css"; 
import infoImage from "../../../../assets/images/cc.jpg";

const CCInfo = () => {
  return (
    <section className="cc-info">
      <div className="cc-info-content">
        <h2 className="cc-info-title">What Are Carbon Credits?</h2>
        <p className="cc-info-description">
          Carbon credits are a market-based mechanism that allows individuals, companies, or countries to offset their carbon emissions by funding activities that reduce or capture carbon dioxide (CO₂). 
          <br />
          <br />
          One carbon credit represents a reduction of 1 ton of CO₂. These credits can be earned by adopting green technologies, improving energy efficiency, and undertaking projects such as tree planting to absorb CO₂ from the atmosphere.
        </p>
        <div className="cc-info-highlight">
          <h3>1 Carbon Credit = 1 Ton of CO₂ Offset</h3>
        </div>
        <div className="cc-info-visual">
          {/* Image source is left empty as per your requirement */}
          <img src={infoImage} alt="Carbon Credit Process" className="cc-info-image" />
        </div>
      </div>
    </section>
  );
};

export default CCInfo;
