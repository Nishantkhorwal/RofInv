import Project from '../models/projectModel.js';
import Inventory from '../models/inventoryModel.js';
import path from 'path';
import SaleRequest from '../models/saleRequestModel.js';
import { ROFUser } from "../models/userModel.js";
import ExcelJS from 'exceljs';
import mongoose from 'mongoose';


// Controller to create a project with its inventory
import multer from 'multer';
import XLSX from 'xlsx';


// Set up multer for file uploads

export const createProjectWithInventory = async (req, res) => {
  try {
    const { projectName, inventoryItems } = req.body;
    const file = req.file; // Uploaded Excel file

    // Validate input
    if (!projectName || (!file && (!inventoryItems || !Array.isArray(inventoryItems)))) {
      return res.status(400).json({
        message: 'Invalid input. Provide a project name and either an inventory list or an Excel file.',
      });
    }

    // Create a new project
    const project = new Project({ name: projectName });
    await project.save();

    let inventoryData = [];

    // Handle inventoryItems from request body
    if (inventoryItems && Array.isArray(inventoryItems)) {
      inventoryData = inventoryItems.map((item) => ({
        projectId: project._id,
        areaSqYard: item.areaSqYard || '',
        W: item.W || '',
        L: item.L || '',
        type: item.type || '',
        unitNumber: item.unitNumber || '',
        floor: item.floor || '',
        carpetArea: item.carpetArea || '',
        balconyArea: item.balconyArea || '',
        terraceArea: item.terraceArea || '',
        mumty: item.mumty || '',
        stiltArea: item.stiltArea || '',
        basementArea: item.basementArea || '',
        commonArea: item.commonArea || '',
        actualArea: item.actualArea || '',
        saleableArea: item.saleableArea || '',
        plcCharges: item.plcCharges || '',
        PLC: item.PLC || '',  // Added PLC field
        status: item.status || 'Unsold', // Default status
      }));
    }

    // Handle inventoryItems from Excel file
    if (file) {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    
      inventoryData = excelData.map((row) => {
        const formattedRow = Object.keys(row).reduce((acc, key) => {
          acc[key.trim()] = row[key];
          return acc;
        }, {});
      
        return {
          projectId: project._id,
          areaSqYard: formattedRow['AREA (Sq.Yard)'] ?? '',
          W: formattedRow['W'] ?? '',
          L: formattedRow['L'] ?? '',
          type: formattedRow['Type'] ?? '',
          unitNumber: formattedRow['Unit No'] ?? '',
          floor: formattedRow['Floor'] ?? '',
          carpetArea: formattedRow['Carpet Area'] ?? '',
          balconyArea: formattedRow['Balcony Area'] ?? '',
          terraceArea: formattedRow['Terrace Area'] ?? '',  // ✅ Fix applied
          mumty: formattedRow['Mumty'] ?? '',              // ✅ Fix applied
          commonArea: formattedRow['Common Area'] ?? '',
          stiltArea: formattedRow['Stilt Area'] ?? '',
          basementArea: formattedRow['Basement Area'] ?? '',
          actualArea: formattedRow['Actual Area'] ?? '',
          saleableArea: formattedRow['Saleable Area'] ?? '',
          plcCharges: formattedRow['Charges'] ?? '',
          PLC: formattedRow['PLC'] ?? '',
          status: formattedRow['Status'] ?? 'Unsold',
        };
      });
      
    }
    

    // Save inventory data to the database
    await Inventory.insertMany(inventoryData);

    res.status(201).json({
      message: 'Project and inventory created successfully!',
      project,
      inventory: inventoryData,
    });
  } catch (error) {
    console.error('Error creating project and inventory:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};




export const getInventoryForProject = async (req, res) => {
  const { projectName } = req.params;
  const userId = req.user.id;

  try {
    // Find the project by name
    const project = await Project.findOne({ name: projectName });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the user and get their assigned projects and visible fields
    const user = await ROFUser.findById(userId);
    const assignedProjects = user.assignedProjects || [];
    const visibleFields = user.visibleFields || [];

    // Check if the user has access to the project
    if (!assignedProjects.includes(project._id.toString())) {
      return res.status(403).json({ message: 'Access denied to this project' });
    }

    // Build a dynamic select statement based on the visible fields for the executive
    let fieldSelect = {};
    visibleFields.forEach(field => {
      fieldSelect[field] = 1; // Include only the fields listed in visibleFields
    });

    // Fetch inventory based on user role and permissions
    let inventory;
    if (user.role === 'executive') {
      inventory = await Inventory.find({ projectId: project._id }).select(fieldSelect);
    } else {
      // For other roles, you might want to include full inventory details
      inventory = await Inventory.find({ projectId: project._id });
    }

    res.json({ inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProjectInventories = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch all projects from the database
    const projects = await Project.find();

    if (projects.length === 0) {
      return res.status(404).json({ message: 'No projects found.' });
    }

    // Find the user and get their assigned projects and visible fields
    const user = await ROFUser.findById(userId);
    const assignedProjects = user.assignedProjects || [];
    const visibleFields = user.visibleFields || [];

    // Convert visibleFields array to an object for select()
    const alwaysVisibleFields = ["type", "unitNumber", "floor", "actualArea", "saleableArea", "plcCharges", "status"];
const fieldSelect = [...new Set([...visibleFields, ...alwaysVisibleFields])].reduce((acc, field) => {
  acc[field] = 1;
  return acc;
}, {});


    // If the user is an admin, they have access to all projects
    if (user.role === 'admin') {
      const projectInventories = await Promise.all(
        projects.map(async (project) => {
          const inventory = await Inventory.find({ projectId: project._id });
          return {
            projectName: project.name,
            projectId: project._id,
            inventory,
          };
        })
      );

      return res.status(200).json({ projectInventories });
    }

    // For non-admin users, fetch only assigned projects
    const projectInventories = await Promise.all(
      projects.map(async (project) => {
        if (!assignedProjects.includes(project._id.toString())) {
          return null; // Skip unauthorized projects
        }

        const inventory = await Inventory.find({ projectId: project._id }).select(fieldSelect);
        
        return {
          projectName: project.name,
          projectId: project._id,
          inventory,
        };
      })
    );

    // Filter out null values
    const filteredInventories = projectInventories.filter((project) => project !== null);

    if (filteredInventories.length === 0) {
      return res.status(403).json({ message: 'No accessible projects for this user.' });
    }

    res.status(200).json({ projectInventories: filteredInventories });
  } catch (error) {
    console.error('Error fetching inventories for all projects:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



export const holdInventoryItem = async (req, res, io) => {
  const { customerName } = req.body;
  const userRole = req.user?.role; // Get user role

  const panCardImagePath = req.files.panCardImage ? req.files.panCardImage[0].path.replace(/\\/g, '/') : null;
  const chequeImagePath = req.files.chequeImage ? req.files.chequeImage[0].path.replace(/\\/g, '/') : null;

  if (!customerName || !panCardImagePath || !chequeImagePath) {
    return res.status(400).json({ success: false, message: 'All fields and images are required.' });
  }

  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.inventoryId,
      { 
        status: 'Hold', 
        customerName, 
        panCardImagePath, 
        chequeImagePath 
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }
    const existingRequest = await SaleRequest.findOne({
      inventoryId: updatedItem._id,
      status: 'Pending',
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'A pending sale request already exists for this inventory.' 
      });
    }

    // Prevent sale request creation if the user is an admin
    if (userRole !== 'admin') {
      const saleRequest = new SaleRequest({
        inventoryId: updatedItem._id,
        requestType: 'Sale Approval',
        createdBy: req.user.id, 
      });

      await saleRequest.save();

      io.emit("requestUpdated", {
        requestId: saleRequest._id,
        status: 'Pending',
        inventoryId: updatedItem._id,
        inventoryStatus: updatedItem.status,
      });

      return res.json({ 
        success: true, 
        item: updatedItem, 
        saleRequest, 
        updatedCustomerName: updatedItem.customerName,
      });
    }

    res.json({ 
      success: true, 
      item: updatedItem, 
      updatedCustomerName: updatedItem.customerName,
      message: "Admin action detected. Inventory held without a sale request."
    });

  } catch (error) {
    console.error('Error holding inventory item:', error);
    res.status(500).json({ success: false, message: 'Error holding inventory item' });
  }
};









// Function to expire sale requests



export const expireOldSaleRequests = async () => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1); // 24 hours ago

  try {
    // Find all pending requests older than 24 hours
    const expiredRequests = await SaleRequest.find({
      status: 'Pending',
      createdAt: { $lte: oneDayAgo },
    });

    for (const request of expiredRequests) {
      request.status = 'Expired';
      await request.save();

      // Reset the inventory status to 'Unsold'
      await Inventory.findByIdAndUpdate(request.inventoryId, { status: 'Unsold' });
      
      console.log(`Sale Request ${request._id} expired and inventory reset.`);
    }
  } catch (error) {
    console.error('Error expiring sale requests:', error);
  }
};


// Sale Requests
export const handleSaleRequest = async (req, res, io) => {
  const { requestId } = req.params;
  const { 
    action, 
    customerName, 
    panCardImagePath, 
    chequeImagePath, 
    customerInfo, 
    unitDetails, 
  
    mainBroker 
  } = req.body; // Allow admins to update these fields

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Invalid action. Must be either "approve" or "reject".' });
  }

  try {
    // Find the sale request
    const saleRequest = await SaleRequest.findById(requestId);
    if (!saleRequest) {
      return res.status(404).json({ success: false, message: 'Sale request not found.' });
    }

    // Find the associated inventory item
    const inventoryItem = await Inventory.findById(saleRequest.inventoryId);
    if (!inventoryItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    // If no new value is provided, keep the existing value from inventory
    saleRequest.customerName = customerName ?? inventoryItem.customerName;
    saleRequest.panCardImagePath = panCardImagePath ?? inventoryItem.panCardImagePath;
    saleRequest.chequeImagePath = chequeImagePath ?? inventoryItem.chequeImagePath;

    // Ensure inventory is also updated with the same values
    inventoryItem.customerName = saleRequest.customerName;
    inventoryItem.panCardImagePath = saleRequest.panCardImagePath;
    inventoryItem.chequeImagePath = saleRequest.chequeImagePath;

    // Ensure required form details are filled before approval
    if (action === 'approve') {
      if (!customerInfo || !unitDetails) {
        return res.status(400).json({ 
          success: false, 
          message: 'Customer, unit, and payment details must be provided before approving the request.' 
        });
      }
      saleRequest.customerInfo = customerInfo;
      saleRequest.unitDetails = unitDetails;
      if (mainBroker) {
        saleRequest.mainBroker = mainBroker;
      }
    }

    // Update sale request status
    saleRequest.status = action === 'approve' ? 'Approved' : 'Rejected';

    // Update inventory status if sale is approved or rejected
    inventoryItem.status = action === 'approve' ? 'Sold' : 'Unsold';

    // Save changes
    await saleRequest.save();
    await inventoryItem.save();

    // Notify connected clients via WebSocket
    io.emit('requestUpdated', {
      requestId: saleRequest._id,
      status: saleRequest.status,
      inventoryId: inventoryItem._id,
      inventoryStatus: inventoryItem.status,
      mainBroker: saleRequest.mainBroker
    });

    console.log(`Sale Request ${action}ed:`, saleRequest);
    res.json({
      success: true,
      message: `Sale request ${action}ed successfully.`,
      saleRequest,
      inventoryItem,
    });
  } catch (error) {
    console.error('Error handling sale request:', error);
    res.status(500).json({ success: false, message: 'Error handling sale request.' });
  }
};



// edit customer details

export const editSaleRequestCustomerDetails = async (req, res) => {
  const { requestId } = req.params;
  const { customerName, customerInfo, unitDetails,  mainBroker } = req.body;

  try {
    // Find the sale request
    const saleRequest = await SaleRequest.findById(requestId);
    if (!saleRequest) {
      return res.status(404).json({ success: false, message: 'Sale request not found.' });
    }
    
    if (customerName !== undefined) { // Explicit check for undefined
      saleRequest.customerName = customerName;
    }
    // Update nested customer details if provided
    if (customerInfo) {
      saleRequest.customerInfo = { ...saleRequest.customerInfo, ...customerInfo };
    }
    if (unitDetails) {
      saleRequest.unitDetails = { ...saleRequest.unitDetails, ...unitDetails };
    }
    if (mainBroker) {
      saleRequest.mainBroker = mainBroker;
    }

    // Save changes
    await saleRequest.save();

    res.json({
      success: true,
      message: 'Customer details updated successfully.',
      saleRequest,
    });
  } catch (error) {
    console.error('Error updating customer details:', error);
    res.status(500).json({ success: false, message: 'Error updating customer details.' });
  }
};




export const getSaleRequests = async (req, res) => {
  try {
    // Fetch all sale requests with populated inventory details
    const saleRequests = await SaleRequest.find()
      .populate('inventoryId', 'customerName chequeImagePath panCardImagePath unitNumber type floor')
      .populate('createdBy mainBroker', 'name');

      const groupedRequests = saleRequests.reduce((acc, request) => {
        const brokerName = request.createdBy.name;
  
        if (!acc[brokerName]) {
          acc[brokerName] = [];
        }
  
        acc[brokerName].push(request);
        return acc;
      }, {});

    res.status(200).json({ saleRequests, groupedRequests });
  } catch (error) {
    console.error('Error fetching sale requests:', error);
    res.status(500).json({ message: 'Error fetching sale requests' });
  }
};





export const updateInventoryStatusWithRequestHandling = async (req, res, io) => {
  const { inventoryId } = req.params;
  const { status, customerName, customerInfo, unitDetails, mainBroker } = req.body;
  const userRole = req.user?.role;

  const panCardImagePath = req.files?.panCardImage ? req.files.panCardImage[0].path.replace(/\\/g, '/') : null;
  const chequeImagePath = req.files?.chequeImage ? req.files.chequeImage[0].path.replace(/\\/g, '/') : null;

  try {
    const inventoryItem = await Inventory.findById(inventoryId);
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    // Handle case where an inventory on "Hold" is marked as "Unsold"
    if (inventoryItem.status === 'Hold' && status === 'Unsold') {
      const pendingRequest = await SaleRequest.findOne({ 
        inventoryId: inventoryItem._id, 
        status: 'Pending' 
      });

      if (pendingRequest) {
        pendingRequest.status = 'Rejected';
        await pendingRequest.save();

        io.emit('requestUpdated', {
          requestId: pendingRequest._id,
          status: 'Rejected',
          inventoryId: inventoryItem._id,
          inventoryStatus: 'Unsold',
        });
      }

      // Clear customer-related fields since sale is canceled
      inventoryItem.customerName = null;
      inventoryItem.panCardImagePath = null;
      inventoryItem.chequeImagePath = null;
    }

    // Handle admin directly selling an inventory without an existing request
    if (userRole === 'admin' && status === 'Sold') {
      const existingRequest = await SaleRequest.findOne({ inventoryId, status: { $in: ['Pending', 'Approved'] } });

      if (!existingRequest) {

        // Create a new approved sale request
        const saleRequest = new SaleRequest({
          inventoryId,
          status: 'Approved',
          requestType: 'Sale Approval',
          createdBy: req.user.id,
          customerName,
          panCardImagePath,
          chequeImagePath,
          customerInfo,
          unitDetails,
          mainBroker,
        });

        await saleRequest.save();
      }
    }

    // Update inventory details
    if (customerName) inventoryItem.customerName = customerName;
    if (panCardImagePath) inventoryItem.panCardImagePath = panCardImagePath;
    if (chequeImagePath) inventoryItem.chequeImagePath = chequeImagePath;

    // Update inventory status
    inventoryItem.status = status;
    await inventoryItem.save();

    io.emit('inventoryStatusUpdated', {
      inventoryId: inventoryItem._id,
      status: inventoryItem.status,
    });

    res.status(200).json({
      success: true,
      message: `Inventory status updated to ${status} successfully.`,
      inventoryItem,
    });
  } catch (error) {
    console.error('Error updating inventory status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// Updated Controllers

/**
 * Handles bulk payment operations (add/update)
 * PUT /api/project/requests/:requestId/payments
 */
export const updatePaymentDetails = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { paymentDetails } = req.body;

    // Validate input
    if (!Array.isArray(paymentDetails)) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment details must be an array" 
      });
    }

    const saleRequest = await SaleRequest.findById(requestId);
    if (!saleRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Sale request not found" 
      });
    }

    // Process each payment
    paymentDetails.forEach(newPayment => {
      if (newPayment._id) {
        // Update existing payment
        const index = saleRequest.paymentDetails.findIndex(
          p => p._id.toString() === newPayment._id
        );
        if (index !== -1) {
          saleRequest.paymentDetails[index] = {
            ...saleRequest.paymentDetails[index],
            ...newPayment
          };
        }
      } else {
        // Add new payment
        saleRequest.paymentDetails.push({
          ...newPayment,
          _id: new mongoose.Types.ObjectId() // Generate new ID
        });
      }
    });

    await saleRequest.save();

    return res.status(200).json({
      success: true,
      message: "Payments processed successfully",
      updatedPayments: saleRequest.paymentDetails
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error processing payments" 
    });
  }
};

/**
 * Handles single payment update
 * PUT /api/project/requests/:requestId/payments/:paymentId
 */
export const updatePayment = async (req, res) => {
  try {
    const { requestId, paymentId } = req.params;
    const updates = req.body;

    // Validate updates
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment data" 
      });
    }

    const saleRequest = await SaleRequest.findById(requestId);
    if (!saleRequest) {
      return res.status(404).json({ 
        success: false, 
        message: "Sale request not found" 
      });
    }

    const paymentIndex = saleRequest.paymentDetails.findIndex(
      p => p._id.toString() === paymentId
    );

    if (paymentIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }

    // Apply updates
    saleRequest.paymentDetails[paymentIndex] = {
      ...saleRequest.paymentDetails[paymentIndex],
      ...updates,
      _id: paymentId // Preserve original ID
    };

    await saleRequest.save();

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      updatedPayment: saleRequest.paymentDetails[paymentIndex]
    });
  } catch (error) {
    console.error("Payment update error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error updating payment" 
    });
  }
};



export const deletePayment = async (req, res) => {
  try {
    const { requestId, paymentId } = req.params;

    const saleRequest = await SaleRequest.findById(requestId);
    if (!saleRequest) {
      return res.status(404).json({
        success: false,
        message: "Sale request not found",
      });
    }

    const paymentIndex = saleRequest.paymentDetails.findIndex(
      (p) => p._id.toString() === paymentId
    );

    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Remove the payment from the array
    saleRequest.paymentDetails.splice(paymentIndex, 1);

    await saleRequest.save();

    return res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Payment deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting payment",
    });
  }
};










export const downloadApprovedRequests = async (req, res) => {
  try {
    const approvedRequests = await SaleRequest.find({ status: 'Approved' })
    .populate('inventoryId', 'unitNumber')
    .select(
      'customerName customerInfo.contactNumber customerInfo.email customerInfo.guardianName customerInfo.panNumber customerInfo.aadharCardNumber customerInfo.address customerInfo.state customerInfo.country customerInfo.pin unitDetails.unitType unitDetails.unitCost'
    );

    if (!approvedRequests.length) {
      return res.status(404).json({ message: 'No approved requests found' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Approved Sale Requests');

    // Define columns
    worksheet.columns = [
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Guardian Name', key: 'guardianName', width: 20 },
      { header: 'PAN Number', key: 'panNumber', width: 15 },
      { header: 'Aadhar Card Number', key: 'aadharCardNumber', width: 20 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'PIN Code', key: 'pin', width: 10 },
      { header: 'Contact Number', key: 'contactNumber', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Unit Type', key: 'unitType', width: 15 },
      { header: 'Unit Cost', key: 'unitCost', width: 15 },
    ];

    // Populate the worksheet with data
    approvedRequests.forEach((request) => {
      worksheet.addRow({
        customerName: request.customerName || 'N/A',
        guardianName: request.customerInfo?.guardianName || 'N/A',
        panNumber: request.customerInfo?.panNumber || 'N/A',
        aadharCardNumber: request.customerInfo?.aadharCardNumber || 'N/A',
        address: request.customerInfo?.address || 'N/A',
        state: request.customerInfo?.state || 'N/A',
        country: request.customerInfo?.country || 'N/A',
        pin: request.customerInfo?.pin || 'N/A',
        contactNumber: request.customerInfo?.contactNumber || 'N/A',
        email: request.customerInfo?.email || 'N/A',
        unitType: request.inventoryId?.unitNumber || 'N/A',
        unitCost: request.unitDetails?.unitCost || 'N/A',
     
      });
    });

    // Set response headers for download
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="approved_requests.xlsx"'
    );
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Write to response instead of saving to file
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const downloadPaymentDetails = async (req, res) => {
  try {
    const { saleRequestId } = req.params; // Get sale request ID from URL params

    if (!saleRequestId) {
      return res.status(400).json({ message: 'Sale request ID is required' });
    }

    const saleRequest = await SaleRequest.findOne({ _id: saleRequestId, status: 'Approved' }).select(
      'customerName paymentDetails'
    );

    if (!saleRequest) {
      return res.status(404).json({ message: 'No approved request found with this ID' });
    }

    if (!saleRequest.paymentDetails.length) {
      return res.status(404).json({ message: 'No payment details found for this request' });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payment Details');

    // Define columns
    worksheet.columns = [
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Cheque Number', key: 'chequeNumber', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Bank Name', key: 'bankName', width: 20 },
      { header: 'Payment Status', key: 'isChequeCleared', width: 15 },
    ];

    // Populate the worksheet with data
    saleRequest.paymentDetails.forEach((payment) => {
      worksheet.addRow({
        customerName: saleRequest.customerName || 'N/A',
        chequeNumber: payment.chequeNumber || 'N/A',
        date: payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A',
        amount: payment.amount || 0,
        bankName: payment.bankName || 'N/A',
        isChequeCleared: payment.isChequeCleared ? 'Cleared' : 'Not Cleared',
      });
    });

    // Set response headers for download
    res.setHeader('Content-Disposition', `attachment; filename="payment_details_${saleRequestId}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Write to response instead of saving to file
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





// export const updateInventoryStatusWithRequestHandling = async (req, res, io) => {
//   const { inventoryId } = req.params;
//   const { status } = req.body;
//   const userRole = req.user?.role; // Ensure req.user is populated via authentication middleware

//   try {
//     const inventoryItem = await Inventory.findById(inventoryId);
//     if (!inventoryItem) {
//       return res.status(404).json({ message: 'Inventory item not found.' });
//     }

//     // If user is an admin, just set status to "Hold" and prevent sale request creation
//     if (userRole === 'admin') {
//       inventoryItem.status = 'Hold';
//       await inventoryItem.save();

//       io.emit('inventoryStatusUpdated', {
//         inventoryId: inventoryItem._id,
//         status: inventoryItem.status,
//       });

//       return res.status(200).json({
//         success: true,
//         message: 'Admin action detected. Status set to Hold.',
//         inventoryItem,
//       });
//     }

//     // Handle specific case: changing from "Hold" to "Unsold"
//     if (inventoryItem.status === 'Hold' && status === 'Unsold') {
//       const pendingRequest = await SaleRequest.findOne({ 
//         inventoryId: inventoryItem._id, 
//         status: 'Pending' 
//       });

//       if (pendingRequest) {
//         pendingRequest.status = 'Rejected';
//         await pendingRequest.save();

//         io.emit('requestUpdated', {
//           requestId: pendingRequest._id,
//           status: 'Rejected',
//           inventoryId: inventoryItem._id,
//           inventoryStatus: 'Unsold',
//         });
//       }

//       inventoryItem.customerName = null;
//       inventoryItem.panCardImagePath = null;
//       inventoryItem.chequeImagePath = null;
//     }

//     // Update the inventory status
//     inventoryItem.status = status;
//     await inventoryItem.save();

//     io.emit('inventoryStatusUpdated', {
//       inventoryId: inventoryItem._id,
//       status: inventoryItem.status,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Inventory status updated to ${status} successfully.`,
//       inventoryItem,
//     });
//   } catch (error) {
//     console.error('Error updating inventory status:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// };














// export const getSaleRequests = async (req, res) => {
//   try {
//     // Fetch all inventory items with status "Hold" that do not have a sale request
//     const holdInventoryWithoutRequest = await Inventory.find({
//       status: 'Hold',
//       _id: { $nin: await SaleRequest.distinct('inventoryId') }, // Exclude inventory already in sale requests
//     });

//     // Create sale requests for these items
//     const newSaleRequests = holdInventoryWithoutRequest.map((inventoryItem) => ({
//       createdBy: req.user.id,
//       inventoryId: inventoryItem._id,
//       requestType: 'Sale Approval',
//     }));

//     // Insert new sale requests into the database
//     if (newSaleRequests.length > 0) {
//       await SaleRequest.insertMany(newSaleRequests);
//       console.log('New Sale Requests Created:', newSaleRequests);
//     }

//     // Fetch all sale requests with populated inventory details
//     const saleRequests = await SaleRequest.find()
//       .populate('inventoryId', 'customerName chequeImagePath panCardImagePath unitNumber type') // Removed towerNumber & size
//       .populate('createdBy', 'name');

//     res.status(200).json({ saleRequests: saleRequests.length ? saleRequests : [] });
//   } catch (error) {
//     console.error('Error fetching sale requests:', error);
//     res.status(500).json({ message: 'Error fetching sale requests' });
//   }
// };







// export const holdInventoryItem = async (req, res, io) => {
//   const { customerName } = req.body;

//   const panCardImagePath = req.files.panCardImage ? req.files.panCardImage[0].path.replace(/\\/g, '/') : null;
//   const chequeImagePath = req.files.chequeImage ? req.files.chequeImage[0].path.replace(/\\/g, '/') : null;

//   if (!customerName || !panCardImagePath || !chequeImagePath) {
//     return res.status(400).json({ success: false, message: 'All fields and images are required.' });
//   }

//   try {
//     const updatedItem = await Inventory.findByIdAndUpdate(
//       req.params.inventoryId,
//       { 
//         status: 'Hold', 
//         customerName, 
//         panCardImagePath, 
//         chequeImagePath 
//       },
//       { new: true }
//     );

//     if (!updatedItem) {
//       return res.status(404).json({ success: false, message: 'Inventory item not found.' });
//     }

//     const saleRequest = new SaleRequest({
//       inventoryId: updatedItem._id,
//       requestType: 'Sale Approval',
//       createdBy: req.user.id, // Assuming req.user contains the authenticated user's data
//     });

//     await saleRequest.save();

//     io.emit("requestUpdated", {
//       requestId: saleRequest._id,
//       status: 'Pending',
//       inventoryId: updatedItem._id,
//       inventoryStatus: updatedItem.status,
//     });

//     res.json({ 
//       success: true, 
//       item: updatedItem, 
//       saleRequest, 
//       updatedCustomerName: updatedItem.customerName,
//     });
//   } catch (error) {
//     console.error('Error holding inventory item:', error);
//     res.status(500).json({ success: false, message: 'Error holding inventory item' });
//   }
// };



// export const getSaleRequests = async (req, res) => {
//   try {
//     // Fetch all inventory items with status "Hold" that do not have a sale request
//     const holdInventoryWithoutRequest = await Inventory.find({
//       status: 'Hold',
//       _id: { $nin: await SaleRequest.distinct('inventoryId') }, // Exclude inventory already in sale requests
//     });

//     // Create sale requests for these items
//     const newSaleRequests = holdInventoryWithoutRequest.map((inventoryItem) => ({
//       createdBy: req.user.id,
//       inventoryId: inventoryItem._id,
//       requestType: 'Sale Approval',
//     }));

//     // Insert new sale requests into the database
//     if (newSaleRequests.length > 0) {
//       await SaleRequest.insertMany(newSaleRequests);
//       console.log('New Sale Requests Created:', newSaleRequests);
//     }

//     // Fetch all sale requests with populated inventory details
//     const saleRequests = await SaleRequest.find()
//       .populate('inventoryId', 'customerName chequeImagePath panCardImagePath towerNumber unitNumber size type')
//       .populate('createdBy', 'name');

//     res.status(200).json({ saleRequests: saleRequests.length ? saleRequests : [] });
//   } catch (error) {
//     console.error('Error fetching sale requests:', error);
//     res.status(500).json({ message: 'Error fetching sale requests' });
//   }
// };








// export const createProjectWithInventory = async (req, res) => {
//   try {
//     const { projectName, inventoryItems } = req.body;
//     const file = req.file; // Uploaded Excel file

//     // Validate input
//     if (!projectName || (!file && (!inventoryItems || !Array.isArray(inventoryItems)))) {
//       return res.status(400).json({
//         message: 'Invalid input. Provide a project name and either an inventory list or an Excel file.',
//       });
//     }

//     // Create a new project
//     const project = new Project({ name: projectName });
//     await project.save();

//     let inventoryData = [];

//     // Handle inventoryItems from request body
//     if (inventoryItems && Array.isArray(inventoryItems)) {
//       inventoryData = inventoryItems.map((item) => ({
//         projectId: project._id,
//         towerNumber: item.towerNumber,
//         unitNumber: item.unitNumber,
//         size: item.size,
//         type: item.type,
//         PLC: item.PLC === 'Yes' ? true : item.PLC === 'No' ? false : false, // Convert 'Yes'/'No' to boolean
//         PLCPercentage: item.PLCPercentage || 0, // Default to 0 if no PLC percentage is provided
//         PLCInfo: item.PLCInfo || '', // Added PLCInfo field
//         plotNumber: item.plotNumber || '', // Added plotNumber field
//       }));
//     }

//     // Handle inventoryItems from Excel file
//     if (file) {
//       const workbook = XLSX.readFile(file.path);
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const excelData = XLSX.utils.sheet_to_json(sheet);

//       inventoryData = excelData.map((row) => ({
//         projectId: project._id,
//         towerNumber: row['Tower Number'], // Adjust column names to match Excel headers
//         unitNumber: row['Unit Number'],
//         size: row['Size'],
//         type: row['Type'],
//         PLC: row['PLC'] === 'Yes' ? true : row['PLC'] === 'No' ? false : false, // Convert 'Yes'/'No' to boolean
//         PLCPercentage: row['PLC Percentage'] || 0, // Handle PLC Percentage
//         PLCInfo: row['PLC Info'] || '', // Handle PLC Info from Excel
//         plotNumber: row['Plot Number'] || '', // Handle Plot Number from Excel
//       }));
//     }

//     // Save inventory data to the database
//     await Inventory.insertMany(inventoryData);

//     res.status(201).json({
//       message: 'Project and inventory created successfully!',
//       project,
//       inventory: inventoryData,
//     });
//   } catch (error) {
//     console.error('Error creating project and inventory:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// };



// export const getInventoryForProject = async (req, res) => {
//   const { projectName } = req.params;

//   try {
//       const project = await Project.findOne({ name: projectName });
      
//       if (!project) {
//           return res.status(404).json({ message: 'Project not found' });
//       }

//       const inventory = await Inventory.find({ projectId: project._id });
//       res.json({ inventory });
//   } catch (error) {
//       console.error('Error fetching inventory:', error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// };




