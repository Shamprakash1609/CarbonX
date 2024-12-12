import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import ReductionStrategies from "../ReductionStrategies/ReductionStrategies";
import "./EmmisionCalulator.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EmissionCalculator = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [fuelType, setFuelType] = useState("Diesel");
  const [period, setPeriod] = useState("Daily");
  const [coalPeriod, setCoalPeriod] = useState("Daily");
  const [usagePeriod, setUsagePeriod] = useState("Daily");
  const [fuelQuantity, setFuelQuantity] = useState("");
  const [coalQuantity, setCoalQuantity] = useState("");
  const [lpgUsed, setLpgUsed] = useState("");
  const [explosivesUsed, setExplosivesUsed] = useState("");
  const [annualFuelEmissions, setAnnualFuelEmissions] = useState(null);
  const [annualMethaneEmissions, setAnnualMethaneEmissions] = useState(null);
  const [annualLpgEmissions, setAnnualLpgEmissions] = useState(null);
  const [annualExplosivesEmissions, setAnnualExplosivesEmissions] =
    useState(null);
  const [totalEmissions, setTotalEmissions] = useState(null);
  // Additional state to track all emissions data
  const [emissionsData, setEmissionsData] = useState(null);
  

  // Constants
  const emissionFactors = {
    Diesel: 2.68,
    Gasoline: 2.31,
    Coal: 2.21,
  };

  const methaneEmissionFactor = 10; // m³ CH₄/ton coal
  const methaneConversion = 0.67; // 1 m³ CH₄ = 0.67 kg CH₄
  const methaneGWP = 25; // GWP of CH₄
  const lpgEmissionFactor = 3.0; // kg CO₂e/kg
  const explosiveEmissionFactor = 0.2; // kg CO₂/kg

  const conversionFactors = {
    Daily: 365,
    Weekly: 52,
    Monthly: 12,
  };

  // Helper to determine the unit
  const getUnit = (fuelType) => {
    switch (fuelType) {
      case "Coal":
        return "kg";
      default:
        return "liters";
    }
  };

  // Calculate Stationary Fuel Emissions
  const calculateFuelEmissions = () => {
    if (!fuelQuantity || isNaN(fuelQuantity) || fuelQuantity <= 0) {
      alert("Please enter a valid fuel quantity.");
      return;
    }

    const annualFuelUsage =
      parseFloat(fuelQuantity) * conversionFactors[period];
    const emissions = annualFuelUsage * emissionFactors[fuelType];
    setAnnualFuelEmissions(emissions.toFixed(2));
    return emissions;
  };

  // Calculate Methane Emissions from Coal Mining
  const calculateMethaneEmissions = () => {
    if (!coalQuantity || isNaN(coalQuantity) || coalQuantity <= 0) {
      alert("Please enter a valid coal quantity.");
      return;
    }

    const annualCoalProduced =
      parseFloat(coalQuantity) * conversionFactors[coalPeriod];
    const methaneEmissions =
      annualCoalProduced * methaneEmissionFactor * methaneConversion;
    const methaneCO2e = methaneEmissions * methaneGWP;

    setAnnualMethaneEmissions(methaneCO2e.toFixed(2));
    return methaneCO2e;
  };

  // Calculate Emissions from Canteen LPG Usage
const calculateLpgEmissions = () => {
  if (!lpgUsed || isNaN(lpgUsed) || lpgUsed <= 0) {
    alert("Please enter a valid LPG usage quantity.");
    return;
  }

  const annualLpgUsage =
    parseFloat(lpgUsed) * conversionFactors[usagePeriod];
  const emissions = annualLpgUsage * lpgEmissionFactor;

  setAnnualLpgEmissions(emissions.toFixed(2));
  return emissions;
};


  // Calculate Explosives Emissions
  const calculateExplosivesEmissions = () => {
    if (!explosivesUsed || isNaN(explosivesUsed) || explosivesUsed <= 0) {
      alert("Please enter a valid amount of explosives used.");
      return;
    }
    const emissions = parseFloat(explosivesUsed) * explosiveEmissionFactor;
    setAnnualExplosivesEmissions(emissions.toFixed(2));
    return emissions;
  };

  // Calculate Total Emissions
const calculateTotalEmissions = () => {
  const fuelEmissions = calculateFuelEmissions() || 0;
  const methaneEmissions = calculateMethaneEmissions() || 0;
  const lpgEmissions = calculateLpgEmissions() || 0;
  const explosivesEmissions = calculateExplosivesEmissions() || 0;

  const total =
    fuelEmissions + methaneEmissions + lpgEmissions + explosivesEmissions;

  setTotalEmissions(total.toFixed(2));

  // Create an object with all emissions data to pass to ReductionStrategies
  const emissionsDataObj = {
    totalEmissions: total.toFixed(2),
    annualFuelEmissions: parseFloat(annualFuelEmissions || 0),
    annualMethaneEmissions: parseFloat(annualMethaneEmissions || 0),
    annualLpgEmissions: parseFloat(annualLpgEmissions || 0),
    annualExplosivesEmissions: parseFloat(annualExplosivesEmissions || 0)
  };

  setEmissionsData(emissionsDataObj);
};

  // Report Generation
  const generatePDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
  
    // Title
    pdf.setFont("times", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor("#f39c12");
    pdf.text("Carbon Emission Report", pageWidth / 2, 20, { align: "center" });
  
    // Subtitle
    pdf.setFont("times", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor("#555");
    pdf.text("Direct Emissions Scope 1", 15, 30);
  
    // Section: Annual Emission Report
    pdf.setFontSize(16);
    pdf.setFont("times", "bold");
    pdf.setTextColor("#f39c12");
    pdf.text("Annual Emission Report", 15, 50);
  
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");
    pdf.setTextColor("#000");
    
    // Adjusted letter spacing by adding custom character spacing
    pdf.setCharSpace(0.3);
  
    const textY = 60;
    const lineHeight = 10;
  
    // Emissions Data
const emissions = [
  `Stationary Fuel Emissions: ${annualFuelEmissions || 0} kg CO₂e`,
  `Methane Emissions: ${annualMethaneEmissions || 0} kg CO₂e`,
  `Canteen LPG Emissions: ${annualLpgEmissions || 0} kg CO₂e`,
  `Explosives Emissions: ${annualExplosivesEmissions || 0} kg CO₂e`,
  `Total Emissions: ${totalEmissions || 0} kg CO₂e`,
];
  
    emissions.forEach((line, index) => {
      pdf.text(line, 15, textY + lineHeight * index);
    });
  
    // Section: Annual Visualization
    const chartTitleY = textY + lineHeight * emissions.length + 20;
    pdf.setFontSize(16);
    pdf.setFont("times", "bold");
    pdf.setTextColor("#f39c12");
    pdf.text("Annual Visualization", 15, chartTitleY);
  
    // Add Chart Canvas to PDF
    const input = document.querySelector(".ec-chart");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180; // Fit to A4 width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const chartY = chartTitleY + 10;
      pdf.addImage(imgData, "PNG", 15, chartY, imgWidth, imgHeight);
  
      // Save the PDF
      pdf.save("Emission_Report.pdf");
    });
  };
  
  

  // Custom colors
  const colors = ["#ff5252", "#ff8f00", "#fdd835", "#29b6f6", "#66bb6a"];

  // Data for the normal bar chart
  const barData = {
    labels: ["Annual Emissions"],
    datasets: [
      {
        label: "Fuel Emissions",
        data: [annualFuelEmissions || 0],
        backgroundColor: colors[0], // Using custom colors
      },
      {
        label: "Methane Emissions",
        data: [annualMethaneEmissions || 0],
        backgroundColor: colors[1],
      },
      {
        label: "LPG Emissions",
        data: [annualLpgEmissions || 0],
        backgroundColor: colors[2],
      },
      {
        label: "Explosives Emissions",
        data: [annualExplosivesEmissions || 0],
        backgroundColor: colors[3],
      },
    ],
  };

  const barOptions = {
    plugins: { legend: { position: "bottom" } },
    responsive: true,
  };

  return (
    <div className="ec-container">
      {/* Left Side */}
      <div className="ec-left">
        <h2 className="ec-title">Calculate Direct Emissions</h2>

        {/* Fuel Emission Calculation */}
        <div className="ec-section">
          <h3 className="ec-subtitle">Stationary Fuel Emissions</h3>
          <div className="ec-input-group">
            <label htmlFor="fuelType" className="ec-label">
              Fuel Type:
            </label>
            <select
              id="fuelType"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="ec-select"
            >
              <option value="Diesel">Diesel</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Coal">Coal</option>
            </select>
          </div>

          <div className="ec-input-group">
            <label className="ec-label">Consumption Period:</label>
            {["Daily", "Weekly", "Monthly"].map((p) => (
              <label key={p} className="ec-radio-label">
                <input
                  type="radio"
                  name="period"
                  value={p}
                  checked={period === p}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="ec-radio"
                />
                {p}
              </label>
            ))}
          </div>

          <div className="ec-input-group">
            <label htmlFor="fuelQuantity" className="ec-label">
              Fuel Quantity:
            </label>
            <div className="ec-quantity-wrapper">
              <input
                type="number"
                id="fuelQuantity"
                value={fuelQuantity}
                onChange={(e) => setFuelQuantity(e.target.value)}
                placeholder={`Enter quantity in ${getUnit(fuelType)}`}
                className="ec-input"
              />
              <span className="ec-unit">{getUnit(fuelType)}</span>
            </div>
          </div>
        </div>

        {/* Methane Emission Calculation */}
        <div className="ec-section">
          <h3 className="ec-subtitle">Methane Emissions from Coal Mining</h3>

          {/* Consumption Period Selection */}
          <div className="ec-input-group">
            <label className="ec-label">Select Consumption Period:</label>
            <div className="ec-radio-options">
              {["Daily", "Weekly", "Monthly"].map((period) => (
                <label key={period} className="ec-radio-label">
                  <input
                    type="radio"
                    name="coalPeriod"
                    value={period}
                    checked={coalPeriod === period}
                    onChange={(e) => setCoalPeriod(e.target.value)}
                    className="ec-radio"
                  />
                  {period}
                </label>
              ))}
            </div>
          </div>

          {/* Coal Mining Quantity Input */}
          <div className="ec-input-group">
            <label htmlFor="coalQuantity" className="ec-label">
              Coal Mining Quantity:
            </label>
            <div className="ec-quantity-wrapper">
              <input
                type="number"
                id="coalQuantity"
                value={coalQuantity}
                onChange={(e) => setCoalQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="ec-input"
              />
              <span className="ec-unit">tons</span>
            </div>
            <small className="ec-help-text">
              <i>
                Enter the total amount of coal mined during the selected period
                in tons.
              </i>
            </small>
          </div>
        </div>

       {/* LPG Usage Calculation */}
<div className="ec-section">
  <h3 className="ec-subtitle">Canteen LPG Usage Emissions</h3>
  <div className="ec-input-group">
    <label className="ec-label">Usage Period:</label>
    {["Daily", "Weekly", "Monthly"].map((p) => (
      <label key={p} className="ec-radio-label">
        <input
          type="radio"
          name="usagePeriod"
          value={p}
          checked={usagePeriod === p}
          onChange={(e) => setUsagePeriod(e.target.value)}
          className="ec-radio"
        />
        {p}
      </label>
    ))}
  </div>

  <div className="ec-input-group">
    <label htmlFor="lpgUsed" className="ec-label">
      LPG Used:
    </label>
    <div className="ec-quantity-wrapper">
      <input
        type="number"
        id="lpgUsed"
        value={lpgUsed}
        onChange={(e) => setLpgUsed(e.target.value)}
        placeholder="Enter quantity in kg"
        className="ec-input"
      />
      <span className="ec-unit">kg</span>
    </div>
  </div>
</div>


        {/* Explosives Emission Calculation */}
        <div className="ec-section">
          <h3 className="ec-subtitle">Emissions from Explosives</h3>
          <div className="ec-input-group">
            <label htmlFor="explosivesUsed" className="ec-label">
              Explosives Used (kg in a Year):
              <span
                className="ec-info-icon"
                onClick={() => {
                  setShowInfo(true); // Show info box when clicked
                  setTimeout(() => setShowInfo(false), 3000); // Auto-hide after 3 seconds
                }}
              >
                ⓘ
              </span>
            </label>
            <input
              type="number"
              id="explosivesUsed"
              value={explosivesUsed}
              onChange={(e) => setExplosivesUsed(e.target.value)}
              placeholder="Enter explosives used in kg"
              className="ec-input"
            />
            {showInfo && (
              <div className="ec-info-box">
                <p>
                  <strong>Note:</strong> This calculation uses the emission
                  factor for <span className="highlight">ANFO explosives</span>{" "}
                  and applies to explosives used{" "}
                  <span className="highlight">in a year</span> only.
                </p>
              </div>
            )}
          </div>
        </div>

        <button onClick={calculateTotalEmissions} className="ec-button">
          Calculate Total Emissions
        </button>
      </div>
      {/* Right Side */}
<div className="ec-right">
  {totalEmissions && (
    <div className="ec-visualizations" id="report-section">
      <h3>Emission Visualization</h3>
      <div className="ec-chart">
        <h4>Normal Bar Chart</h4>
        <Bar data={barData} options={barOptions} />
      </div>

      {/* Annual Emission Report */}
      {(annualFuelEmissions ||
        annualMethaneEmissions ||
        annualLpgEmissions ||
        totalEmissions) && (
        <div className="ec-report">
          <h3 className="ec-report-title">Annual Emission Report</h3>
          {annualFuelEmissions && (
            <p className="ec-report-text">
              <strong>Stationary Fuel Emissions:</strong>{" "}
              {annualFuelEmissions} kg CO₂e
            </p>
          )}
          {annualMethaneEmissions && (
            <p className="ec-report-text">
              <strong>Methane Emissions:</strong> {annualMethaneEmissions} kg
              CO₂e
            </p>
          )}
          {annualLpgEmissions && (
      <p className="ec-report-text">
        <strong>Canteen LPG Emissions:</strong> {annualLpgEmissions} kg CO₂e
      </p>
    )}
          {annualExplosivesEmissions && (
            <p className="ec-report-text">
              <strong>Explosives Emissions:</strong>{" "}
              {annualExplosivesEmissions} kg CO₂e
            </p>
          )}
          {totalEmissions && (
            <p className="ec-report-text ec-total">
              <strong>Total Emissions:</strong> {totalEmissions} kg CO₂e
            </p>
          )}
        </div>
      )}
    </div>
  )}

  {/* Button to Generate PDF */}
  <button
    onClick={() => generatePDF()}
    className="ec-download-button"
  >
    Download Report as PDF
  </button>
</div>

{/* Add ReductionStrategies component */}
{emissionsData && (
        <div className="ec-reduction-strategies">
          <ReductionStrategies 
            totalEmissions={emissionsData.totalEmissions} 
            emissionsBreakdown={emissionsData}
          />
        </div>
      )}

  

    </div>
  );
};

export default EmissionCalculator;
