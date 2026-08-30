import express from "express";
import {
  sendServiceEmail,
  sendPortfolioContactEmail,
  sendWithinReachContactEmail,
} from "../controllers/mail.controller.js";

const router = express.Router();

router.post("/service-email", sendServiceEmail);
router.post("/portfolio-contact", sendPortfolioContactEmail);
router.post("/withinreach-contact", sendWithinReachContactEmail);

export default router;