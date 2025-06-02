import express from "express";
import {
  sendServiceEmail,
  sendRoobRequestEmail,
  sendBiteSizedMenuContactEmail,
  sendBiteSizedMenuOrderRequestEmail,
} from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/service-email", sendServiceEmail);
router.post("/roob-commission-request", sendRoobRequestEmail);
router.post("/bitesized-contact-email", sendBiteSizedMenuContactEmail);
router.post("/bitesized-order-request", sendBiteSizedMenuOrderRequestEmail);

export default router;
