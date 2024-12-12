import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./CCChallenges.css"; // Include the relevant styles

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CCChallenges = () => {
  // Sample data for emissions breakdown (in tons of CO₂)
  const emissionsData = {
    labels: ["Excavation", "Transport", "Ventilation", "Processing", "Other Emissions"],
    datasets: [
      {
        label: "Emissions Breakdown",
        data: [50, 30, 10, 5, 5], // Sample emissions data (replace with actual data later)
        backgroundColor: "#ff9900", // Highlight color (Bright Orange)
        borderColor: "#ff9900",
        borderWidth: 1,
      },
    ],
  };

  // Sample data for carbon credit benefits (in %)
  const carbonCreditBenefits = {
    labels: ["Revenue from Trading", "Environmental Impact", "Sustainability Goals", "Compliance with Regulations"],
    datasets: [
      {
        data: [40, 30, 20, 10], // Example distribution of benefits
        backgroundColor: ["#f39c12", "#ff9900", "#e67e22", "#ffa07a"], // Colors for segments
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Breakdown of CO₂ Emissions from Coal Mines",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw} tons of CO₂`; // Custom tooltip to display values in tons
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "How Coal Mines Benefit from Carbon Credits",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw}%`; // Show percentage on tooltip
          },
        },
      },
    },
  };

  return (
    <section className="cc-challenges">
      <div className="cc-challenges-content">
        <h2 className="cc-challenges-title">Challenges in Carbon Emissions from Coal Mines</h2>
        <p className="cc-challenges-description">
          Coal mines contribute significantly to global CO₂ emissions through activities such as excavation, transport, and processing. 
          To mitigate these emissions, carbon credits play a vital role by offsetting the environmental impact through various sustainable initiatives.
        </p>
        
        {/* Flex container to display charts side by side */}
        <div className="cc-challenges-visual-container">
          <div className="cc-challenges-visual">
            <h3>Emissions Breakdown</h3>
            <Bar data={emissionsData} options={options} />
          </div>

          <div className="cc-challenges-benefits-visual">
            <h3>How Coal Mines Benefit from Carbon Credits</h3>
            <Pie data={carbonCreditBenefits} options={pieOptions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CCChallenges;
