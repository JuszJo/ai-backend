import express from "express";

import rateLimit from "express-rate-limit";
import { MULTER_CONFIG } from "../config/multer.config.js";
import { PDFController } from "../controllers/pdf.controller.js";
import { ChatController } from "../controllers/chat.controller.js";

const imageLimiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 5,
})

const router = express.Router();

router.get("/limiter-test", imageLimiter, (_, res) => { res.status(200).end() });

router.post("/pdf/analyze", MULTER_CONFIG.upload.single("pdf"), PDFController.handleAnalyzePDF)

router.post("/chat", ChatController.handleChat)

export default router;