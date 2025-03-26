import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // Ensures valid 10-digit phone number
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Password must be at least 6 characters
    },
    role: {
      type: String,
      enum: ["admin", "executive"],
      required: true,
    },
    assignedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", // References the Project model
      },
    ],
    visibleFields: [
      {
        type: String, // List of fields like 'towerNumber', 'unitNumber', etc.
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export const ROFUser = mongoose.model("ROFUser", userSchema);

