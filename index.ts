// import "./instrument.js"

// import * as Sentry from "@sentry/node";

import express from "express";
import useRoutes from "./routes/routes.js";
import { db } from "./config/db.config.js";
import mongoose from "mongoose";
import { Server } from "http";
import { pinoLogger } from "./config/pino.config.js";

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(pinoLogger);

useRoutes(app);

if (process.env.NODE_ENV == "production") {
  // Sentry.setupExpressErrorHandler(app);
}

const PORT = Number(process.env.PORT as string) || 3000;

// Only start the server if this file is being run directly
async function main() {
  try {
    console.log("Starting mongo connection");

    await mongoose.connect(db);

    // while (mongoose.connection.readyState !== 1) {
    //     console.log(`Current connection state: ${mongoose.connection.readyState}`);

    //     await new Promise(resolve => setTimeout(resolve, 2000));
    // }

    mongoose.connection.on('error', (err) => {
      if (process.env.NODE_ENV == "production") {
        // Sentry.captureException(err)
      }

      console.error('Mongoose connection error:', err);

      process.exit(1);
    });


    console.log("MongoDB connection fully established");

    const server = app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });

    async function gracefulShutdown(server: Server) {
      console.log('Received shutdown signal. Shutting down gracefully...');

      server.close(async () => {
        console.log('Express server closed.');

        await mongoose.connection.close();
        console.log('MongoDB connection closed.');

        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));
  }
  catch (error) {
    console.error(error);
  }
}

main();

export { app };