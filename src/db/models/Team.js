import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Describe the schema
const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    stadium: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    manager: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

// Create a model from the schema
export default mongoose.model('Team', teamSchema);
