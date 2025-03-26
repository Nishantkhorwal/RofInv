import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import projectRoutes from './routes/projectRoute.js';
import userRoutes from './routes/userRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Inventory from './models/inventoryModel.js';
import Project from './models/projectModel.js';
import SaleRequest from './models/saleRequestModel.js';
import { expireOldSaleRequests } from './controllers/projectController.js';
import cron from 'node-cron';




mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
    // updatePLCField();

  })
  .catch((err) => {
    console.log(err);
  });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);

const allowedOrigins = [
  'https://rofinventorymanagement.netlify.app', // Production frontend
  'http://localhost:5173',
  'https://rofconnect.com', 
];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Replace with your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE" ], 
    credentials: true, 
  },
});


app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use('/api/project', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
server.listen(process.env.PORT, () => {
  console.log('Server listening on port 3000!');
});

cron.schedule('0 * * * *', () => {  // Runs every hour
  console.log('Running expireOldSaleRequests cron job...');
  expireOldSaleRequests();
});

export { io };

// const clearCollections = async () => {
//   try {
//     await Project.deleteMany({});
//     console.log('Projects collection cleared.');

//     await Inventory.deleteMany({});
//     console.log('Inventories collection cleared.');

//     await SaleRequest.deleteMany({});
//     console.log('Requests collection cleared.');

//     console.log('All specified collections have been cleared successfully.');
//     process.exit(0); // Exit the process after clearing the collections
//   } catch (error) {
//     console.error('Error clearing collections:', error);
//     process.exit(1); // Exit the process with an error code
//   }
// };

// // Call the function
// clearCollections();

// async function updatePLCField() {
//   try {
//     const Inventory = mongoose.model('Inventory'); // Assuming your Inventory model is exported like this
//     await Inventory.updateMany(
//       {}, // Match all inventory items
//       {
//         $set: {
//           PLC: false,  // Set PLC field to 'false' (No)
//           PLCPercentage: 0, // Optionally, set PLCPercentage to 0 if needed
//         },
//       }
//     );
//     console.log('PLC field set to No (false) for all existing inventories.');
//   } catch (error) {
//     console.error('Error updating PLC field:', error);
//   }
// }


// const addSequentialPlotNumber = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

//     const inventories = await Inventory.find();

//     for (let i = 0; i < inventories.length; i++) {
//       const inventory = inventories[i];
//       inventory.plotNumber = (i + 1).toString(); // Assign sequential numbers starting from 1
//       await inventory.save();
//     }

//     console.log('Sequential plot numbers added to all inventory items.');
//   } catch (error) {
//     console.error('Error adding sequential plot numbers:', error);
//   } finally {
//     mongoose.connection.close(); // Close the database connection
//   }
// };

// // Run the function immediately when the app starts (for one-time update)
// addSequentialPlotNumber();

// Your server setup and other logic here

