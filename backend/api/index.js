import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import projectRoutes from './routes/projectRoute.js';
import userRoutes from './routes/userRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { expireOldSaleRequests } from './controllers/projectController.js';
import cron from 'node-cron';

// MongoDB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);

// CORS Configuration (Must be on Top)
const allowedOrigins = [
  "https://rofconnect.com",
  "https://rofinventorymanagement.netlify.app",
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
}));

// Middleware to Ensure CORS Headers Apply to All Responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Routes
app.use('/api/project', projectRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// WebSocket (Socket.io)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Run Cron Job Every Hour
cron.schedule('0 * * * *', () => {
  console.log('Running expireOldSaleRequests cron job...');
  expireOldSaleRequests();
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
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

