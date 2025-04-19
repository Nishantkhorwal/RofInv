import express from "express";
import { registerUser, loginUser, updateSelfInfo, getUser, updateUserByAdmin, getAllUsers, deleteUserByAdmin, getUserActivity, getAllUsersActivity} from "../controllers/userController.js";
import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", authenticateUser, updateSelfInfo);
router.get("/get", authenticateUser, getUser);

router.put("/update/:userId", authenticateUser, updateUserByAdmin);
router.get("/all", authenticateUser, getAllUsers);
router.delete("/delete/:userId", authenticateUser, deleteUserByAdmin);
router.get('/user-activity/:userId', authenticateUser, getUserActivity);
router.get('/getAllUsersActivity', authenticateUser, getAllUsersActivity);


export default router;
