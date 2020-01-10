import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Describe the schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'USER',
    required: true,
  },
});

// Create a model from the schema
export default mongoose.model('User', userSchema);
