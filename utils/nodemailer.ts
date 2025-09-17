/* import dotenv from "dotenv"
dotenv.config();

import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

import { isProd } from '../config/server.config.js';

const prodHost = process.env.PROD_MAILTRAP_DEV_HOST;
const prodPort = process.env.PROD_MAILTRAP_DEV_PORT as string;
const prodUser = process.env.PROD_MAILTRAP_DEV_USERNAME;
const prodPass = process.env.PROD_MAILTRAP_DEV_PASSWORD;

const prodOptions: SMTPTransport.Options = {
  host: prodHost,
  port: Number(prodPort),
  auth: {
    user: prodUser,
    pass: prodPass
  }
}

const devOptions: SMTPTransport.Options = {
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
}

const options: SMTPTransport.Options = isProd ? prodOptions : devOptions

export const transporter = createTransport(options) */