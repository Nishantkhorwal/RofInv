import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROFUser } from "../models/userModel.js";
import dotenv from 'dotenv';

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
    const users = await ROFUser.find().select("name phone role assignedProjects visibleFields");

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ message: "Failed to fetch users.", error: error.message || error });
  }
};



export const registerUser = async (req, res) => {
  try {
    const { name, phone, password, role, assignedProjects, visibleFields } = req.body;

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
    const fieldsForExecutive = role === "executive" ? [...new Set([...(visibleFields || []), ...alwaysVisibleFields])] : [];


    // Create a new user
    const newUser = new ROFUser({
      name,
      phone,
      password: hashedPassword,
      role,
      assignedProjects: role === "executive" ? assignedProjects || [] : [], // Assign projects only if role is executive
      visibleFields: fieldsForExecutive, // Ensure 'Status' is included
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



export const getUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is passed in the request via JWT middleware

    const user = await ROFUser.findById(userId).select("name phone role assignedProjects visibleFields");

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
        role: user.role,
        assignedProjects: user.assignedProjects,
        visibleFields: finalVisibleFields, // Ensures required fields are always included
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
    const { name, phone, password } = req.body;
    const userId = req.user.id; // Assuming the userId is stored in the JWT token

    // Ensure at least one field is provided for update (name, phone, or password)
    if (!name && !phone && !password) {
      return res.status(400).json({ message: "At least one field (name, phone, or password) must be provided to update." });
    }

    // Find the user to be updated
    const user = await ROFUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save updated user information
    await user.save();

    // Ensure always-visible fields are included in the response
    const alwaysVisibleFields = ["type", "unitNumber", "floor", "actualArea", "saleableArea", "plcCharges", "status"];
    const finalVisibleFields = [...new Set([...(user.visibleFields || []), ...alwaysVisibleFields])];

    return res.status(200).json({
      message: "Your information has been updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        assignedProjects: user.assignedProjects,
        visibleFields: finalVisibleFields, // Ensuring required fields are always included
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
    const { name, phone, password, role, assignedProjects, visibleFields } = req.body;

    // Debug what was received
    console.log(`VisibleFields received:`, visibleFields);

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized. Only admins can edit users." });
    }

    const user = await ROFUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    // Modified condition to check for any truthy value
    if (user.role === "executive") {
      if (assignedProjects !== undefined) {
        user.assignedProjects = assignedProjects;
      }

      const alwaysVisibleFields = ["type", "unitNumber", "floor", "actualArea", "saleableArea", "plcCharges", "status"];

      // Check if visibleFields exists (not necessarily undefined)
      if (visibleFields) {
        user.visibleFields = [...new Set([...visibleFields, ...alwaysVisibleFields])];
      } else if (visibleFields === null) {
        // Handle explicit null case if needed
        user.visibleFields = [...alwaysVisibleFields];
      }
    }

    await user.save();

    return res.status(200).json({ 
      message: "User updated successfully.",
      user: {
        ...user.toObject(),
        visibleFields: user.visibleFields // Ensure this is included in response
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


  

  
