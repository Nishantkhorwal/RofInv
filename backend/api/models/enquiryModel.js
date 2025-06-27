import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const LandingEnquiry = mongoose.model('LandingEnquiry', enquirySchema);
export default LandingEnquiry;
