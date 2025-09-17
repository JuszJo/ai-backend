// import express, { Request, Response } from "express";
// import rateLimit from "express-rate-limit";

// import { verifyTokenMiddleware } from "../middleware/auth.middleware.js";
// import {
//   handleLogin,
//   handlePostProfile,
//   handleGetProfile,
//   handleSignup,
//   handleRefresh,
//   handlePhoneNumber,
//   handleOTP,
//   handlePostRole,
//   handlePostEmail,
//   handleResendOTP,
//   handleCloseAccount,
//   handleVerifyEmail,
//   handlePostTakerProfile
// } from "../controllers/auth.controller.js";

// const router = express.Router();

// const otpLimiter = rateLimit({
//   limit: 1,
//   windowMs: 1000 * 60 * 5
// })

// const phoneLimiter = rateLimit({
//   limit: 5,
//   windowMs: 1000 * 60 * 1
// })

// router.get("/auth", verifyTokenMiddleware, (req: Request, res: Response) => {
//   res.status(200).json({ message: "authenticated", role: req.user.role, id: req.user.id, payload: req.user })

//   // checkCredit(req.user);
// });

// router.post("/auth/refresh", handleRefresh);
// router.post("/auth/close-account", verifyTokenMiddleware, handleCloseAccount);

// router.get("/auth/verify-email/:hash", handleVerifyEmail);

// router.post("/phoneNumber", phoneLimiter, handlePhoneNumber);

// router.post("/otp/resend", otpLimiter, handleResendOTP);
// router.post("/otp", handleOTP);

// router.post("/login", handleLogin);
// router.post("/signup", handleSignup);
// router.post("/profile", verifyTokenMiddleware, handlePostProfile);
// router.post("/taker-profile", verifyTokenMiddleware, handlePostTakerProfile);
// router.post("/role", verifyTokenMiddleware, handlePostRole);
// router.post("/email", verifyTokenMiddleware, handlePostEmail);

// router.post("/test/otp", otpLimiter, (_, res) => { res.send("ok") });

// router.get("/profile", verifyTokenMiddleware, handleGetProfile);

// export default router;