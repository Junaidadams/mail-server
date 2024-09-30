import express from "express";
import { sendServiceEmail } from "../controllers/mail.controller.js"; // Ensure the correct extension

const router = express.Router();

router.post("/service-email", sendServiceEmail);

export default router;
