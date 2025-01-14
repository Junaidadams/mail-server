import express from "express";
import {
  sendServiceEmail,
  sendRoobRequestEmail,
} from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/service-email", sendServiceEmail);
router.post("/roob-commission-request", sendRoobRequestEmail);

export default router;
