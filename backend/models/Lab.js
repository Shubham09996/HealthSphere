import mongoose from 'mongoose';

const LabSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    labId: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: false, // Make it optional for now, can be changed to true later if all labs must belong to a hospital
    },
    testsOffered: [
      {
        testName: { type: String, required: true },
        testType: { type: String },
        price: { type: Number, required: true, default: 0 },
      },
    ],
    // Add other lab-specific fields as needed
  },
  { 
    timestamps: true 
  }
);

const Lab = mongoose.model('Lab', LabSchema);

export default Lab;
