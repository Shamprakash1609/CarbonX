const User = require("../models/user");
const Emission = require("../models/emission");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

// Constants for calculations
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

// Helper function to calculate emissions
const calculateEmissions = (data) => {
  const {
    fuelType,
    fuelQuantity,
    period,
    coalQuantity,
    coalPeriod,
    lpgUsed,
    usagePeriod,
    explosivesUsed,
  } = data;

  // Fuel Emissions
  const annualFuelUsage = parseFloat(fuelQuantity || 0) * (conversionFactors[period] || 0);
  const fuelEmissions = annualFuelUsage * (emissionFactors[fuelType] || 0);

  // Methane Emissions
  const annualCoalProduced = parseFloat(coalQuantity || 0) * (conversionFactors[coalPeriod] || 0);
  const methaneEmissions = annualCoalProduced * methaneEmissionFactor * methaneConversion;
  const methaneCO2e = methaneEmissions * methaneGWP;

  // LPG Emissions
  const annualLpgUsage = parseFloat(lpgUsed || 0) * (conversionFactors[usagePeriod] || 0);
  const lpgEmissions = annualLpgUsage * lpgEmissionFactor;

  // Explosives Emissions
  const explosivesEmissions = parseFloat(explosivesUsed || 0) * explosiveEmissionFactor;

  // Total Emissions
  const totalEmissions =
    fuelEmissions + methaneCO2e + lpgEmissions + explosivesEmissions;

  return {
    annualFuelEmissions: fuelEmissions,
    annualMethaneEmissions: methaneCO2e,
    annualLpgEmissions: lpgEmissions,
    annualExplosivesEmissions: explosivesEmissions,
    totalEmissions,
  };
};



exports.calculate = async (req, res) => {
  const {
    userId,
    fuelType,
    fuelQuantity,
    period,
    coalQuantity,
    coalPeriod,
    lpgUsed,
    usagePeriod,
    explosivesUsed,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Validate the userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid User ID format." });
  }

  try {
    // Convert userId to ObjectId properly
    const objectId = new mongoose.Types.ObjectId(userId);

    // Check if the user exists
    const userExists = await User.findById(objectId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate numeric fields
    if (
      fuelQuantity == null ||
      coalQuantity == null ||
      lpgUsed == null ||
      explosivesUsed == null
    ) {
      return res.status(400).json({ error: "All numeric fields must be provided." });
    }

    const fuelQuantityNum = parseFloat(fuelQuantity);
    const coalQuantityNum = parseFloat(coalQuantity);
    const lpgUsedNum = parseFloat(lpgUsed);
    const explosivesUsedNum = parseFloat(explosivesUsed);

    if (
      isNaN(fuelQuantityNum) ||
      isNaN(coalQuantityNum) ||
      isNaN(lpgUsedNum) ||
      isNaN(explosivesUsedNum)
    ) {
      return res.status(400).json({ error: "Invalid input data. Numeric fields must be numbers." });
    }

    // Perform calculations
    const emissions = calculateEmissions({
      fuelType,
      fuelQuantity: fuelQuantityNum,
      period,
      coalQuantity: coalQuantityNum,
      coalPeriod,
      lpgUsed: lpgUsedNum,
      usagePeriod,
      explosivesUsed: explosivesUsedNum,
    });

    // Save data to the database
    const newEmission = new Emission({
      userId: objectId, // Save as ObjectId
      ...emissions,
    });
    await newEmission.save();

    res.status(200).json({
      message: "Emissions calculated and stored successfully",
      emissions,
    });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "An error occurred while processing the data", details: error.message });
  }
};


exports.emissions = async (req, res) => {
  // Get token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer token

  // Validate token
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Get the secret key from the environment variable
    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    // Decode the JWT to get userId (assuming the JWT contains userId in the payload)
    const decoded = jwt.verify(token, secretKey); // Use your JWT secret here

    // Extract userId from decoded token (use 'id' instead of 'userId')
    const userId = decoded.id;

    // Check if the userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    // Retrieve the user's emissions, sorted by timestamp (descending)
    const userEmissions = await Emission.find({ userId })
      .sort({ timestamp: -1 });

    // Return the data (empty array if no emissions found)
    if (userEmissions.length === 0) {
      return res.status(200).json({ message: "No emissions found for this user", emissions: [] });
    }

    // Successfully return the emissions data
    res.status(200).json(userEmissions);
  } catch (error) {
    console.error("Error fetching emissions:", error);
    res.status(500).json({ error: "An error occurred while fetching the data", details: error.message });
  }
};



