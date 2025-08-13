import express from "express";
import {
  sendServiceEmail,
  sendRoobRequestEmail,
  sendBiteSizedMenuContactEmail,
  sendBiteSizedMenuOrderRequestEmail,
  sendPortfolioContactEmail,
} from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/service-email", sendServiceEmail);
router.post("/portfolio-contact", sendPortfolioContactEmail);
router.post("/roob-commission-request", sendRoobRequestEmail);
router.post("/bitesized-contact-email", sendBiteSizedMenuContactEmail);
router.post("/bitesized-order-request", sendBiteSizedMenuOrderRequestEmail);

export default router;
