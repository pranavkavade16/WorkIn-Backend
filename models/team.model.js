const mongoose = require('mongoose');
// Team Schema
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Team names must be unique
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to User model (owners)
  ],
  description: { type: String }, // Optional description forthe team
});
module.exports = mongoose.model('Team', teamSchema);
