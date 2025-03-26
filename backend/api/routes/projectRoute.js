import express from 'express';
import { createProjectWithInventory, getInventoryForProject , holdInventoryItem, getAllProjectInventories, getSaleRequests, handleSaleRequest, updateInventoryStatusWithRequestHandling } from '../controllers/projectController.js';
import upload from '../multerConfig.js';
import { io } from '../index.js';
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();


// Route to create a project with its inventory

router.get('/:projectName/inventory', authenticateUser, getInventoryForProject);
router.post('/hold/:inventoryId',authenticateUser, upload.fields([
    { name: 'panCardImage', maxCount: 1 },
    { name: 'chequeImage', maxCount: 1 }
  ]), (req, res) => holdInventoryItem(req, res, io));
router.get('/inventories',authenticateUser, getAllProjectInventories);
// Admin approves a sale request
router.put('/requests/:requestId',(req, res) => handleSaleRequest(req, res, io));    // Accepts 'approve' or 'reject' as action in body
// Get all pending sale requests
router.get('/request',authenticateUser, getSaleRequests);
router.post('/create', upload.single('file'), createProjectWithInventory);
router.put('/inventory/:inventoryId/update-status', (req, res) => updateInventoryStatusWithRequestHandling(req, res, io));



export default router;
