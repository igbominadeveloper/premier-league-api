import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Describe the schema
const fixtureSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  homeTeamId: {
    type: String,
    required: true,
  },
  awayTeamId: {
    type: String,
    required: true,
  },
  referee: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'PENDING',
  },
  uniqueLink: {
    type: String,
    required: true,
    unique: true,
  },
  homeTeamGoals: {
    type: Number,
    required: true,
    default: 0,
  },
  awayTeamGoals: {
    type: Number,
    required: true,
    default: 0,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

// Create a model from the schema
export default mongoose.model('Fixture', fixtureSchema);
