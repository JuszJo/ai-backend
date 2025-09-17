// import * as Sentry from "@sentry/node";
import { Response as ExpressResponse } from "express";
import { z } from "zod";

import dotenv from "dotenv";

dotenv.config();

export function throwError(response: Response) {
  throw new Error(`Request failed with status: ${response.status} - ${response.statusText}`);
}

export function handleError(res: ExpressResponse, error: any) {
  if (error instanceof z.ZodError) {
    const fieldErrors = error.flatten().fieldErrors;

    const errors = Object.keys(fieldErrors).reduce((prev, curr) => {
      const str = fieldErrors[curr]?.reduce((prev, curr) => prev + " " + curr, "")

      return { ...prev, [curr]: str?.trim() }
    }, {})

    res.status(400).json({ message: "validation error", ...errors });
  }
  else if (error.code == 11000) {
    console.log(error);

    const duplicateFields = Object.keys(error.keyPattern).reduce((prev, curr) => {
      return { ...prev, [curr]: `Specified ${curr.split(".").join(" ")} already exists` }
    }, {})

    res.status(400).json({ message: "Duplicate Error", ...duplicateFields });
  }
  else {
    console.error(error);

    if (process.env.NODE_ENV === "production") {
      // Sentry.captureException(error); // 💥 send to Sentry
    }

    res.status(500).json({ message: "something went wrong, please try again later" });
  }
}