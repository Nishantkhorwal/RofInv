import express from "express";
import { getWelcomeLetter, sendWelcomeLetter } from "../controllers/welcomeController.js";


const router = express.Router();

// Public routes
router.post("/create", sendWelcomeLetter);
router.get("/get", getWelcomeLetter);


export default router;