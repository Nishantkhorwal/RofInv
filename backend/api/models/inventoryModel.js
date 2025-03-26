import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    areaSqYard: {
      type: String,
      required: true,
    },
    W: {
      type: String,
      required: true,
    },
    L: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    unitNumber: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    carpetArea: {
      type: String,
      required: true,
    },
    balconyArea: {
      type: String,
      required: true,
    },
    terraceArea: {
      type: String,
      required: false,
    },
    mumty: {
      type: String,
      required: false,
    },
    stiltArea: {
      type: String,
      required: false,
    },
    basementArea: {
      type: String,
      required: false,
    },
    commonArea: {
      type: String,
      required: false,
    },
    actualArea: {
      type: String,
      required: true,
    },
    saleableArea: {
      type: String,
      required: true,
    },
    PLC: {
      type: String,
      required: false,
    },
    plcCharges: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['Unsold', 'Hold', 'Sold'],
      default: 'Unsold',
    },
    customerName: {
      type: String,
      required: false,
    },
    panCardImagePath: {
      type: String,
      required: false,
    },
    chequeImagePath: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model('Inventory', inventorySchema);





// import mongoose from 'mongoose';

// const inventorySchema = new mongoose.Schema(
//   {
//     projectId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Project',
//       required: true,
//     },
//     plotNumber : {
//       type: String,
//       required : false  
//     },
//     towerNumber: {
//       type: String,
//       required: true,
//     },
//     unitNumber: {
//       type: String,
//       required: true,
//     },
//     size: {  
//       type: Number, // Assuming size is in square feet or meters
//       required: true,
//     },
//     type: {
//       type: String, // e.g., "2BHK", "3BHK", "Studio"
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['Unsold', 'Hold', 'Sold'],
//       default: 'Unsold', // Default status is 'Unsold'
//     },
//     PLC: {
//       type: Boolean, // Yes or No (true or false)
//       required: false, // Not mandatory
//     },
//     PLCPercentage: {
//       type: Number, // Percentage value
//       required: false, // Optional
//     },
//     PLCInfo: {
//       type: String, // Percentage value
//       required: false, // Optional
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   }
// );

// export default mongoose.model('Inventory', inventorySchema);
