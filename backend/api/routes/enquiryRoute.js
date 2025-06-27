import express from 'express';
import { createEnquiry } from '../controllers/enquiryController.js';

const router = express.Router();

router.post('/send', createEnquiry);

export default router;
