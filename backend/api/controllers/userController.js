import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROFUser } from "../models/userModel.js";
import dotenv from 'dotenv';
import SaleRequest from "../models/saleRequestModel.js";
import Inventory from '../models/inventoryModel.js';

dotenv.config();


export const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Ensure only admins can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized. Only admins can delete users." });
    }

    // Check if the user exists
    const user = await ROFUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const saleRequests = await SaleRequest.find({ createdBy: userId });

    // Collect inventory IDs from these sale requests
    const inventoryIds = saleRequests.map(request => request.inventoryId);

    // Update only inventory items that are in "Hold" status to "Unsold"
    await Inventory.updateMany(
      { _id: { $in: inventoryIds }, status: "Hold" },
      { $set: { status: "Unsold" } }
    );

    await SaleRequest.deleteMany({ createdBy: userId });

    // Delete the user
    await ROFUser.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error in deleteUserByAdmin:", error);
    return res.status(500).json({ message: "Failed to delete user.", error: error.message || error });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    // Ensure only admins can fetch all users

    // Fetch all users with selected fields
    const users = await ROFUser.find().select("name phone email reraNumber gstNumber  role assignedProjects visibleFields managerId hiddenInventories");

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ message: "Failed to fetch users.", error: error.message || error });
  }
};
export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify the user exists
    const user = await ROFUser.findById(userId).select("name role phone");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch all sale requests by the user
    const allSaleRequests = await SaleRequest.find({ createdBy: userId }).populate("inventoryId");

    // Separate based on status
    const soldInventories = allSaleRequests
      .filter(req => req.status === "Approved")
      .map(req => ({
        inventory: req.inventoryId,
        requestType: req.requestType,
        saleRequestId: req._id,
        approvedAt: req.updatedAt || req.createdAt,
      }));

    const holdingInventories = allSaleRequests
      .filter(req => req.status === "Hold")
      .map(req => ({
        inventory: req.inventoryId,
        requestType: req.requestType,
        saleRequestId: req._id,
        heldAt: req.createdAt,
      }));

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
      activitySummary: {
        totalSaleRequests: allSaleRequests.length,
        soldCount: soldInventories.length,
        holdingCount: holdingInventories.length,
      },
      soldInventories,
      holdingInventories,
    });

  } catch (error) {
    console.error("Error in getUserActivity:", error);
    return res.status(500).json({ message: "Failed to fetch user activity.", error: error.message || error });
  }
};
export const getAllUsersActivity = async (req, res) => {
  try {
    // Get all users
    const users = await ROFUser.find({}).select("name role phone managerId");

    const activityData = [];

    for (const user of users) {
      // Get all sale requests for each user
      const allSaleRequests = await SaleRequest.find({ createdBy: user._id }).populate("inventoryId");

      const soldInventories = allSaleRequests
        .filter(req => req.status === "Approved")
        .map(req => ({
          inventory: req.inventoryId,
          requestType: req.requestType,
          saleRequestId: req._id,
          approvedAt: req.updatedAt || req.createdAt,
        }));

      const holdingInventories = allSaleRequests
        .filter(req => req.status === "Pending")
        .map(req => ({
          inventory: req.inventoryId,
          requestType: req.requestType,
          saleRequestId: req._id,
          heldAt: req.createdAt,
        }));

      activityData.push({
        user: {
          id: user._id.toString(),
          name: user.name,
          role: user.role,
          phone: user.phone,
          managerId: user.managerId?.toString() || null,
        },
        activitySummary: {
          totalSaleRequests: allSaleRequests.length,
          soldCount: soldInventories.length,
          holdingCount: holdingInventories.length,
        },
        soldInventories,
        holdingInventories,
      });
    }

    return res.status(200).json({
      totalUsers: users.length,
      activities: activityData,
    });

  } catch (error) {
    console.error("Error in getAllUsersActivity:", error);
    return res.status(500).json({ message: "Failed to fetch all user activities.", error: error.message || error });
  }
};





export const registerUser = async (req, res) => {
  try {
    const { name, phone, password, role, assignedProjects, visibleFields, email, gstNumber, reraNumber,managerId,  } = req.body;

    // Check for missing fields
    if (!name || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await ROFUser.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: "User with this phone already exists." });
    }

    // Hash the password (use bcrypt or similar)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ensure the 'Status' field is always included for executives
    const alwaysVisibleFields = ["type", "unitNumber", "floor", "actualArea", "saleableArea", "plcCharges", "status"];
    const fieldsForExecutive = ["executive", "manager"].includes(role) ? [...new Set([...(visibleFields || []), ...alwaysVisibleFields])] : [];

    if (role !== "executive" && managerId) {
      return res.status(400).json({ message: "Only executives can have a manager assigned." });
    } 
    // Create a new user
    const newUser = new ROFUser({
      name,
      phone,
      email: email || undefined, // Only store if provided
      gstNumber: gstNumber || undefined,
      reraNumber: reraNumber || undefined,
      password: hashedPassword,
      role,
      assignedProjects: ["executive", "manager"].includes(role) ? assignedProjects || [] : [],
      visibleFields: fieldsForExecutive, // Ensure 'Status' is included
      managerId: role === "executive" ? managerId || null : null,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error in registerUser:", error); // Log the error
    res.status(500).json({ message: "Registration failed.", error: error.message || error });
  }
};





export const loginUser = async (req, res) => {
  try {
    const { phone, password, role } = req.body;

    // Check for missing fields
    if (!phone || !password || !role) {
      return res
        .status(400)
        .json({ message: "Phone number, password, and role are required." });
    }

    // Find user by phone number
    const user = await ROFUser.findOne({ phone }).populate("assignedProjects", "name");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const allowedPhones = ["9560890395","9643511641","9999240371","9810572879","9873839647","9810099444","7042465389","9873423419","9717130266","9899018016","7701839634","7701839633","9560222400"]; // Add more numbers as needed

    // Inside your loginUser function, after finding the user
    if (!allowedPhones.includes(user.phone)) {
      return res.status(403).json({ message: "Normal Users are temporarily closed." });
    }


    // Check if the role matches
    if (user.role !== role) {
      return res
        .status(403)
        .json({ message: `User is not authorized to log in as ${role}.` });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const alwaysVisibleFields = ["type", "unitNumber", "floor", "actualArea", "saleableArea", "plcCharges", "status"];
const finalVisibleFields = [...new Set([...(user.visibleFields || []), ...alwaysVisibleFields])];

return res.status(200).json({
  message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful.`,
  token,
  user: {
    id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    assignedProjects: user.assignedProjects, // List of assigned projects
    visibleFields: finalVisibleFields, // Ensure required fields are always visible
  },
});

    // Send successful login response with assignedProjects and visibleFields
    // return res.status(200).json({
    //   message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful.`,
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     phone: user.phone,
    //     role: user.role,
    //     assignedProjects: user.assignedProjects, // List of assigned projects
    //     visibleFields: user.visibleFields, // Fields allowed to view
    //   },
    // });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Login failed.", error: error.message || error });
  }
};

export const hideInventoryForUser = async (req, res) => {
  try {
    const { userId, inventoryId } = req.body;

    await ROFUser.findByIdAndUpdate(userId, {
      $addToSet: { hiddenInventories: inventoryId }, // prevents duplicates
    });

    res.status(200).json({ message: "Inventory hidden for user" });
  } catch (error) {
    console.error("Error in hideInventoryForUser:", error);
    res.status(500).json({ message: "Failed to hide inventory", error: error.message });
  }
};

export const unhideInventoryForUser = async (req, res) => {
  try {
    const { userId, inventoryId } = req.body;

    await ROFUser.findByIdAndUpdate(userId, {
      $pull: { hiddenInventories: inventoryId },
    });

    res.status(200).json({ message: "Inventory unhidden for user" });
  } catch (error) {
    console.error("Error in unhideInventoryForUser:", error);
    res.status(500).json({ message: "Failed to unhide inventory", error: error.message });
  }
};



export const getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is passed in the request via JWT middleware

    const user = await ROFUser.findById(userId).select("name phone email reraNumber gstNumber role assignedProjects visibleFields managerId hiddenInventories");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fields that should always be visible to all users
    const alwaysVisibleFields = ["type", "unitNumber", "floor", "actualArea", "saleableArea", "plcCharges", "status"];
    // Merge always-visible fields with dynamically assigned fields
    const finalVisibleFields = [...new Set([...(user.visibleFields || []), ...alwaysVisibleFields])];

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        gstNumber: user.gstNumber,
        reraNumber: user.reraNumber,
        role: user.role,
        managerId: user.managerId,
        assignedProjects: user.assignedProjects,
        visibleFields: finalVisibleFields, // Ensures required fields are always included
        hiddenInventories: user.hiddenInventories || [],
      },
    });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(500).json({ message: "Error fetching user data." });
  }
};



// Update Self Information Controller (Only name, phone, and password)
export const updateSelfInfo = async (req, res) => {
  try {
    const { name, phone, email, gstNumber, reraNumber } = req.body;
    const userId = req.user.id;

    // Ensure at least one field is provided for update
    if (!name && !phone && !email && !gstNumber && !reraNumber) {
      return res.status(400).json({ message: "At least one field must be provided to update." });
    }

    const user = await ROFUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update editable fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (gstNumber) user.gstNumber = gstNumber;
    if (reraNumber) user.reraNumber = reraNumber;

    await user.save();

    return res.status(200).json({
      message: "Your information has been updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        gstNumber: user.gstNumber,
        reraNumber: user.reraNumber,
        role: user.role,
        assignedProjects: user.assignedProjects,
        visibleFields: user.visibleFields,
      },
    });
  } catch (error) {
    console.error("Error in updateSelfInfo:", error);
    return res.status(500).json({ message: "Failed to update your information.", error: error.message || error });
  }
};


export const updateUserByAdmin = async (req, res) => {
  try {
    // Debug logging
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const { userId } = req.params;
    const { name, phone, password, role, assignedProjects, visibleFields, email, gstNumber, reraNumber, managerId,hiddenInventories,  } = req.body;

    // Debug what was received
    console.log(`VisibleFields received:`, visibleFields);

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized. Only admins can edit users." });
    }

    const user = await ROFUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const previousRole = user.role;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email !== undefined) user.email = email;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;
    if (reraNumber !== undefined) user.reraNumber = reraNumber;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;
    if (managerId !== undefined) {
      user.managerId = managerId || null;
    }


    if (previousRole === "manager" && role === "executive") {
      await ROFUser.updateMany(
        { managerId: user._id },
        { $unset: { managerId: "" } }
      );
    }

    if (previousRole === "executive" && role === "manager") {
      user.managerId = null; // Managers should not have a managerId
    }

    // Modified condition to check for any truthy value
    if (["executive", "manager"].includes(user.role)) {
      if (assignedProjects !== undefined) {
        user.assignedProjects = assignedProjects;
      }

      const alwaysVisibleFields = ["type", "unitNumber", "floor", "actualArea", "saleableArea", "plcCharges", "status"];

      // Check if visibleFields exists (not necessarily undefined)
      if (visibleFields) {
        user.visibleFields = visibleFields;
      } else if (visibleFields === null) {
        // Handle explicit null case if needed
        user.visibleFields = [...alwaysVisibleFields];
      }

      
    }

    if (hiddenInventories !== undefined) {
      user.hiddenInventories = hiddenInventories; 
      }

    await user.save();

    return res.status(200).json({ 
      message: "User updated successfully.",
      user: {
        ...user.toObject(),
        visibleFields: user.visibleFields, // Ensure this is included in response
        hiddenInventories: user.hiddenInventories,
      }
    });
  } catch (error) {
    console.error("Error in updateUserByAdmin:", error);
    return res.status(500).json({ message: "Failed to update user.", error: error.message || error });
  }
};










// export const getUser = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming user ID is passed in the request via JWT middleware

//     const user = await ROFUser.findById(userId).select('name phone'); // Modify the fields as needed

//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     return res.status(200).json({ user });
//   } catch (error) {
//     console.error('Error in getUser:', error);
//     return res.status(500).json({ message: 'Error fetching user data.' });
//   }
// };


  

  
