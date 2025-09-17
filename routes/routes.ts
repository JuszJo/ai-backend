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

  app.get("/api/update", (req, res) => {
    const MIN_BUILD_NUMBER = 9;
    const MIN_APP_NUMBER = "1.0.3";
    let updateLink = "https://quagapro.com"

    const { android } = req.query as any;

    if (android && (android == "true" || android == true)) {
      updateLink = "https://play.google.com/store/apps/details?id=com.quagaltd.quaga";
    }
    else {
      updateLink = "https://apps.apple.com/ng/app/quaga/id6748447263";
    }

    try {
      res.status(200).json({ message: "successful", data: { MIN_BUILD_NUMBER, MIN_APP_NUMBER, link: updateLink } });
    }
    catch (error) {
      handleError(res, error);
    }
  })

  app.post("/api/update", (req, res) => {
    const buildNumber = req.body.buildNumber;
    const version = req.body.version;
    const env = req.body.env;

    if (!buildNumber) {
      res.status(400).json({ message: "build number needed" });

      return;
    }

    if (!version) {
      res.status(400).json({ message: "version needed" });

      return;
    }

    try {
      console.log(buildNumber, version, env);

      res.status(200).json({ message: "successful" });
    }
    catch (error) {
      handleError(res, error);
    }
  })

  app.get("/api/countries", (_, res) => {
    const supported = ["Nigeria", "United Kingdom", "United States", "Canada"];

    try {
      const data = getCountriesForNumberInput();

      const finalData = data.filter(c => supported.includes(c.name))

      res.status(200).json({ message: "successful", data: finalData });

      return;
    }
    catch (error) {
      handleError(res, error);
    }
  })


  // app.use("/api", authRoute);

  app.get("/api/limiter", limiter, (_, res) => { res.status(200).json({ message: "ok" }) });

  app.use("/api", verifyTokenMiddleware);

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