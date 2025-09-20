// import * as Sentry from "@sentry/node";

import { Express } from "express";
import cors from "cors"

import welcomeRoute from "./welcome.route.js";
import mainRoute from "./main.route.js";
import rateLimit from "express-rate-limit";

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
}