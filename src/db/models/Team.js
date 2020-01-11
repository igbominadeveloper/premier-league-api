import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Describe the schema
const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    stadium: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    manager: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

// Create a model from the schema
export default mongoose.model('Team', teamSchema);
