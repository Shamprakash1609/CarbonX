import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Title
);

const ReductionStrategies = ({ totalEmissions, emissionsBreakdown }) => {
  const [strategies, setStrategies] = useState([]);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [reductionPercentage, setReductionPercentage] = useState(40); // Default to 40%

  useEffect(() => {
    if (totalEmissions) {
      calculateReductionStrategies(parseFloat(totalEmissions), reductionPercentage);
    }
  }, [totalEmissions, reductionPercentage]);

  const calculateReductionStrategies = (emissions, percentage) => {
    const reductionTarget = (emissions * percentage) / 100; // Reduction target based on percentage

    // Afforestation Calculation
    const carbonSequestrationRate = 22; // kg CO2 per tree per year
    const requiredTrees = Math.ceil(reductionTarget / carbonSequestrationRate);

    // Solar Energy Offset Calculation
    const solarPanelCapacity = 0.25; // kW per panel
    const annualSolarGeneration = solarPanelCapacity * 8760 * 0.2; // 20% capacity factor
    const solarCO2Offset = 0.5; // kg CO2 per kWh
    const requiredSolarPanels = Math.ceil(
      reductionTarget / (annualSolarGeneration * solarCO2Offset)
    );
    const solarCapacityRequired = (requiredSolarPanels * solarPanelCapacity).toFixed(2);

    // Electric Vehicles Calculation
    const evOffsetPerYear = 2000; // Average kg CO2 offset per EV per year
    const evBatteryCapacity = 40; // kWh per EV
    const requiredEVs = Math.ceil(reductionTarget / evOffsetPerYear);
    const totalEVBatteryCapacity = (requiredEVs * evBatteryCapacity).toFixed(2);

    // Wind Energy Calculation
    const windTurbineCapacity = 2; // MW per turbine
    const annualWindGeneration = windTurbineCapacity * 8760 * 0.35; // 35% capacity factor
    const windCO2Offset = 0.4; // kg CO2 per kWh
    const requiredWindTurbines = Math.ceil(
      reductionTarget / (annualWindGeneration * windCO2Offset)
    );
    const windCapacityRequired = (requiredWindTurbines * windTurbineCapacity).toFixed(2);

    // Strategies List
    const strategiesList = [
      {
        name: 'Afforestation',
        value: requiredTrees,
        description: `${requiredTrees} trees need to be planted to offset the target`,
        icon: '🌳',
        contribution: (requiredTrees * carbonSequestrationRate).toFixed(2),
        details: `Each tree offsets ${carbonSequestrationRate} kg CO2 per year.`
      },
      {
        name: 'Solar Panels',
        value: requiredSolarPanels,
        description: `${requiredSolarPanels} solar panels (${solarCapacityRequired} kW capacity) need to be installed to offset the target`,
        icon: '☀️',
        contribution: (requiredSolarPanels * annualSolarGeneration * solarCO2Offset).toFixed(2),
        details: `Each panel generates ${annualSolarGeneration.toFixed(2)} kWh annually, offsetting ${solarCO2Offset} kg CO2 per kWh.`
      },
      {
        name: 'Electric Vehicles',
        value: requiredEVs,
        description: `${requiredEVs} EVs (${totalEVBatteryCapacity} kWh total battery capacity) need to be deployed to offset the target`,
        icon: '🚗',
        contribution: (requiredEVs * evOffsetPerYear).toFixed(2),
        details: `Each EV offsets ${evOffsetPerYear} kg CO2 annually with a ${evBatteryCapacity} kWh battery.`
      },
      {
        name: 'Wind Turbines',
        value: requiredWindTurbines,
        description: `${requiredWindTurbines} wind turbines (${windCapacityRequired} MW capacity) need to be installed to offset the target`,
        icon: '🌬️',
        contribution: (requiredWindTurbines * annualWindGeneration * windCO2Offset).toFixed(2),
        details: `Each turbine generates ${(annualWindGeneration / 1000).toFixed(2)} MWh annually, offsetting ${windCO2Offset} kg CO2 per kWh.`
      }
    ];

    // Pie Chart Data
    const pieData = {
      labels: strategiesList.map((s) => s.name),
      datasets: [
        {
          data: strategiesList.map((s) => parseFloat(s.contribution)),
          backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
          hoverBackgroundColor: ['#0077D5', '#00B090', '#E6A817', '#D96C2E']
        }
      ]
    };

    // Bar Chart Data
    const barData = {
      labels: strategiesList.map((s) => s.name),
      datasets: [
        {
          label: 'CO2 Reduction Contribution (kg)',
          data: strategiesList.map((s) => parseFloat(s.contribution)),
          backgroundColor: ['#FFBB28', '#FF8042', '#0088FE', '#00C49F'],
          borderColor: ['#FF8042', '#FFBB28', '#0077D5', '#00B090'],
          borderWidth: 1
        }
      ]
    };

    setStrategies(strategiesList);
    setPieChartData(pieData);
    setBarChartData(barData);
  };

  return (
    <div className="reduction-strategies-container">
      <h2>Emission Reduction Strategies</h2>

      {totalEmissions && (
        <div>
          {/* Slider for Reduction Percentage */}
          <div className="reduction-slider">
            <label htmlFor="reduction-percentage">
              Reduction Target: {reductionPercentage}%
            </label>
            <input
              type="range"
              id="reduction-percentage"
              min="10"
              max="100"
              step="5"
              value={reductionPercentage}
              onChange={(e) => setReductionPercentage(Number(e.target.value))}
            />
          </div>

          {/* Strategies Overview */}
          <div className="strategies-overview">
            <h3>Offset Strategies</h3>
            <div className="strategies-grid">
              {strategies.map((strategy) => (
                <div key={strategy.name} className="strategy-card">
                  <span className="strategy-icon">{strategy.icon}</span>
                  <h4>{strategy.name}</h4>
                  <p>{strategy.description}</p>
                  <p>{strategy.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visualization Section */}
          <div className="visualization-section">
            <h3>Visualization of Reduction Strategies</h3>
            <div className="charts-container">
              {pieChartData && (
                <div className="pie-chart">
                  <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
                </div>
              )}
              {barChartData && (
                <div className="bar-chart">
                  <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!totalEmissions && (
        <p>Calculate total emissions to see reduction strategies</p>
      )}
    </div>
  );
};

export default ReductionStrategies;
