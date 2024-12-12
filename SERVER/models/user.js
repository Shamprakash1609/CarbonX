const { Schema, model } = require('mongoose');

const coalMineOwners = [
  'ECL', 'BCCL', 'CESC', 'SAIL', 'OCL Iron Steel Limited', 'WBPDCL',
  'IISCO', 'TSL', 'CCL', 'NTPC ', 'HIL', 'DVC ', 'JSMDCL', 'NCL',
  'WCL', 'TUML', 'SISCL', 'JPVL', 
  'Sasan Power (Reliance Power Limited)',
  'RCCPL Ltd, a subsidiary of Birla Corp', 'SECL', 'RRVUNL',
  'BALCO (Vedanta Group)', 'AMBUJA', 'NTPC', 'MCL', 'NLC Ltd',
  'GMR Group', 'NEC', 'GMDCL', 'GIPCL', 'GHCL Limited', 'BLMCL',
  'RSMML', 'VS Lignite Power Private Limited', 'TSPGCL', 'SCCL'
];

const mineTypes = ['Under ground', 'Open Cast', 'Mixed'];

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: true, trim: true },
  jobRole: { type: String, required: true, trim: true },
  mineName: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  Ownership: { type: String, enum: coalMineOwners, required: true },
  Type: { type: String, enum: mineTypes, required: true },
  isAdmin: { type: Boolean, default: false },
  resetPasswordOtp: Number,
  resetPasswordOtpExpires: Date,
});

// Adding a unique index to the email field
userSchema.index({ email: 1 }, { unique: true });

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = model('User', userSchema);
