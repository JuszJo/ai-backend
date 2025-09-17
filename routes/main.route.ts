import express from "express";

import rateLimit from "express-rate-limit";

const imageLimiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 5,
})


const router = express.Router();

// TODO: ADD PATCH PROPERTY ALONE

// LANDLORD

router.get("/limiter-test", imageLimiter, (_, res) => { res.status(200).end() });


export default router;