// import * as Sentry from "@sentry/node";

import { Express } from "express";
import cors from "cors"

import crypto from "crypto"

import { verifyTokenMiddleware } from "../middleware/auth.middleware.js";

import welcomeRoute from "./welcome.route.js";
// import authRoute from "./auth.route.js";
import mainRoute from "./main.route.js";
import { handleError } from "../utils/handleError.js";
import rateLimit from "express-rate-limit";
import { getCountriesForNumberInput } from "../services/countries.service.js";

const limiter = rateLimit({
  windowMs: 1000 * 60 * 15,
  limit: 5,
})

export default function useRoutes(app: Express) {
  app.use(cors({ origin: "*" }));

  app.get("/healthz", (_, res) => {
    res.send("ok");

    return;
  })

  // app.use("/api", authRoute);

  app.get("/api/limiter", limiter, (_, res) => { res.status(200).json({ message: "ok" }) });

  // app.use("/api", verifyTokenMiddleware);

  app.use("/api", welcomeRoute);

  app.use("/api", mainRoute);

  // app.post("/api/push-notification-token", async (req, res) => {
  //   try {
  //     const { token } = req.body;

  //     if (!token || typeof token != "string") {
  //       res.status(400).json({ message: "invalid push token" });

  //       return;
  //     }

  //     const result = await UserModel.updateOne({ _id: req.user.id }, { $set: { pushToken: token } })

  //     if (result.matchedCount < 1) {
  //       res.status(400).json({ message: "user does not exist" });

  //       return;
  //     }

  //     res.status(200).json({ message: "successful" })
  //   }
  //   catch (error) {
  //     handleError(res, error);
  //   }
  // })
}