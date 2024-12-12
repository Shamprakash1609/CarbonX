import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import "./CCCalculator.css";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const CCCalculator = () => {
  // State for sliders and counters
  const [methaneCapture, setMethaneCapture] = useState(0); // Number of methane capture systems
  const [electricVehicles, setElectricVehicles] = useState(0); // Number of electric vehicles
  const [treesPlanted, setTreesPlanted] = useState(0); // Number of trees planted
  const [selectedTree, setSelectedTree] = useState("Neem (Azadirachta indica)"); // Default tree species
  const [selectedEV, setSelectedEV] = useState("Standard EV"); // Default EV type

  // Tree carbon sequestration data (in kgC/tree)
  const treeSequestration = {
    "Neem (Azadirachta indica)": 3289.8,
    "Banyan (Ficus benghalensis)": 2375.5,
    "Tamarind (Tamarindus indica)": 1666.9,
    "Casuarina (Casuarina equisetifolia)": 1530.5,
    "Indian Beech (Pongamia pinnata)": 865.9,
    "Drumstick Tree (Moringa oleifera)": 15775,
    "Eucalyptus (Eucalyptus citriodora)": 1814,
    "Peepal (Ficus religiosa)": 2500,
    "Jackfruit (Artocarpus heterophyllus)": 1800,
    "Mango (Mangifera indica)": 2100,
  };

  // Constants for calculations
  const methaneCaptureCO2 = 25; // CO2 reduction per methane capture system in tons
  const evCO2ReductionPerEV = 3; // CO2 reduction per EV in tons per year
  const normalVehicleCO2 = 5; // CO2 emitted by normal vehicle per year

  const evTypes = {
    "Standard EV": 3,
    "Heavy Duty EV": 5,
    "Light Duty EV": 2,
  };

  const carbonCreditRate = 1; // 1 carbon credit = 1 ton of CO2

  // Calculate total CO2 offsets
  const totalMethaneCO2 = methaneCapture * methaneCaptureCO2;
  const totalEVCO2 = electricVehicles * evTypes[selectedEV];
  const totalTreeCO2 = treesPlanted * treeSequestration[selectedTree] / 1000; // Convert kg to tons
  const totalCO2 = totalMethaneCO2 + totalEVCO2 + totalTreeCO2;
  const totalCredits = totalCO2 * carbonCreditRate;

  // Data for visualizations
  const stackedBarData = {
    labels: ["Methane Capture", "Electric Vehicles", "Tree Planting"],
    datasets: [
      {
        label: "Offset Contribution (tons)",
        data: [totalMethaneCO2, totalEVCO2, totalTreeCO2],
        backgroundColor: ["#66bb6a", "#43a047", "#2e7d32"], // Green shades
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["Methane Capture", "Electric Vehicles", "Tree Planting"],
    datasets: [
      {
        label: "CO₂ Offset (tons)",
        data: [totalMethaneCO2, totalEVCO2, totalTreeCO2],
        borderColor: "#43a047",
        backgroundColor: "#66bb6a",
        pointBackgroundColor: "#2e7d32",
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "CO₂ Offset Contributions",
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.raw} tons of CO₂`;
          },
        },
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  // Helper function to limit increments within bounds
  const adjustValue = (value, min, max, step) => Math.min(Math.max(value + step, min), max);

  return (
    <div className="carbon-credits-calculator">
      <div className="slider-container">
        <h2>Adjust Inputs</h2>
        <div className="calculator-group">
          <div className="calculator-section">
            <h3>Methane Capture Systems</h3>
            <div className="input-controls">
              <button onClick={() => setMethaneCapture(adjustValue(methaneCapture, 0, 10, -1))}>-</button>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={methaneCapture}
                onChange={(e) => setMethaneCapture(Number(e.target.value))}
              />
              <button onClick={() => setMethaneCapture(adjustValue(methaneCapture, 0, 10, 1))}>+</button>
            </div>
            <p>{methaneCapture} systems (CO₂ offset: {totalMethaneCO2} tons)</p>
          </div>

          <div className="calculator-section">
            <h3>Electric Vehicles</h3>
            <select onChange={(e) => setSelectedEV(e.target.value)} value={selectedEV}>
              {Object.keys(evTypes).map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
            <div className="input-controls">
              <button onClick={() => setElectricVehicles(adjustValue(electricVehicles, 0, 100, -1))}>-</button>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={electricVehicles}
                onChange={(e) => setElectricVehicles(Number(e.target.value))}
              />
              <button onClick={() => setElectricVehicles(adjustValue(electricVehicles, 0, 100, 1))}>+</button>
            </div>
            <p>{electricVehicles} vehicles (CO₂ offset: {totalEVCO2} tons)</p>
          </div>

          <div className="calculator-section">
            <h3>Tree Planting</h3>
            <select onChange={(e) => setSelectedTree(e.target.value)} value={selectedTree}>
              {Object.keys(treeSequestration).map((tree) => (
                <option key={tree} value={tree}>
                  {tree}
                </option>
              ))}
            </select>
            <div className="input-controls">
              <button onClick={() => setTreesPlanted(adjustValue(treesPlanted, 0, 1000, -10))}>-</button>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={treesPlanted}
                onChange={(e) => setTreesPlanted(Number(e.target.value))}
              />
              <button onClick={() => setTreesPlanted(adjustValue(treesPlanted, 0, 1000, 10))}>+</button>
            </div>
            <p>{treesPlanted} trees ({selectedTree} - CO₂ offset: {totalTreeCO2.toFixed(2)} tons)</p>
          </div>
        </div>
        <div className="carbon-credits-summary">
          <h3>Total CO₂ Reduction: {totalCO2.toFixed(2)} tons</h3>
          <h3>Total Carbon Credits Earned: {totalCredits.toFixed(2)} credits</h3>
        </div>
      </div>

      <div className="carbon-credits-visual">
        <h2>Visualizations</h2>
        <Bar data={stackedBarData} options={options} />
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
};

export default CCCalculator;
