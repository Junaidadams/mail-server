import express from "express";
import { sendServiceEmail } from "../controllers/mail.controller";

const router = express.Router();

router.post("/service-email", sendServiceEmail);

export default router;
