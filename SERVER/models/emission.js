const mongoose = require('mongoose'); 
const { Schema, model } = mongoose; 

const emissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  annualFuelEmissions: { type: Number, default: 0 },
  annualMethaneEmissions: { type: Number, default: 0 },
  annualLpgEmissions: { type: Number, default: 0 },
  annualExplosivesEmissions: { type: Number, default: 0 },
  totalEmissions: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
});

module.exports = model('Emission', emissionSchema);
