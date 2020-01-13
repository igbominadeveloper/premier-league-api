import mongoose from 'mongoose';

import Team from './Team';
import User from './User';

const Schema = mongoose.Schema;

// Describe the schema
const fixtureSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    homeTeamId: {
      type: Schema.Types.Mixed,
      required: true,
      ref: Team,
    },
    awayTeamId: {
      type: Schema.Types.Mixed,
      required: true,
      ref: Team,
    },
    referee: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'PENDING',
      uppercase: true,
      enum: ['PENDING', 'PLAYED', 'CANCELLED', 'POSTPONED'],
    },
    uniqueLink: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: String,
      required: true,
      ref: User,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

// Create a model from the schema
export default mongoose.model('Fixture', fixtureSchema);
