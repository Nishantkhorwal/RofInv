import mongoose from 'mongoose';

const saleRequestSchema = new mongoose.Schema({
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Expired'],
    default: 'Pending',
  },
  requestType: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ROFUser',
    required: true,
  },
  mainBroker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ROFUser', // Assuming brokers are also stored in ROFUser model
    default: null,  // Default to null if no broker is assigned
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Fields taken from Inventory schema
  customerName: { type: String }, // Already stored, no need for name in customerInfo
  panCardImagePath: { type: String },
  chequeImagePath: { type: String },

  // Additional customer details (optional)
  customerInfo: {
    guardianName: { type: String },
    age: { type: Number },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    panNumber: { type: String },
    aadharCardNumber: { type: String },
    occupation: { type: String },
    residentStatus: { type: String },
    address: { type: String },
    state: { type: String },
    country: { type: String },
    pin: { type: String },
    email: { type: String },
    contactNumber: { type: String },
  },
  unitDetails: {
    unitType: { type: String },
    unitCost: { type: Number },
    otherCharges: { type: Number },
  },
  basePrice: { type: Number, default : 0},
  paymentDetails: [
    {
      chequeNumber: { type: String },
      date: { type: Date },
      amount: { type: Number },
      bankName: { type: String },
      isChequeCleared: { type: Boolean, default: false }, 
      percentagePaid: { type: Number },         // e.g. 25%
      nextPaymentDate: { type: Date },          // Schedule tracking
      remarks: { type: String }, 
    }
  ],
  brokerageDetails: {
    totalBrokerage: { type: Number , default  : 0 },
    isBrokerageComplete: { type: Boolean, default: false },
    bba: { type: Boolean, default: false },
  }
  
});

const SaleRequest = mongoose.model('SaleRequest', saleRequestSchema);

export default SaleRequest;

