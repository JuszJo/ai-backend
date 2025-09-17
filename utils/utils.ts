// import validator from "validator";
// import pkg from "number-to-words";
// import { v4 as uuidv4 } from "uuid";
// import { normalizeFileName } from "./uploadFile.js";

// const toWords = pkg.toWords;

// export function isNgPhoneNumber(value: string) {
//   const result = validator.isMobilePhone(value, "en-NG");

//   return result;
// }

// export function isUkPhoneNumber(value: string) {
//   const result = validator.isMobilePhone(value, "en-GB");

//   return result;
// }

// export function isValidPhoneNumber(value: string) {
//   const result = validator.isMobilePhone(value, "any", { strictMode: true });

//   return result;
// }

// export function getCountryCode(phoneNumber: string) {
//   if (isNgPhoneNumber(phoneNumber)) {
//     return 'NG';
//   }

//   // default fallback, you can improve this later with libphonenumber-js
//   return 'INTL';
// }


// export function bytesToKilobytes(bytes: number): number {
//   if (isNaN(bytes) || bytes < 0) return 0;

//   return Math.floor(bytes / 1024);
// }

// export function formatFileSize(bytes: number): string {
//   if (isNaN(bytes) || bytes < 0) return "0 B";

//   if (bytes < 1024) return `${bytes} B`;

//   const kb = bytes / 1024;
//   if (kb < 1024) return `${kb.toFixed(2)} KB`;

//   const mb = kb / 1024;
//   if (mb < 1024) return `${mb.toFixed(2)} MB`;

//   const gb = mb / 1024;
//   return `${gb.toFixed(2)} GB`;
// }

// export function getFileTypeFromMimetype(mimetype: string): string {
//   if (!mimetype.includes("/")) return "";

//   return mimetype.split("/")[1].toLowerCase(); // e.g., "png", "pdf"
// }

// type MonthCategory = "This Month" | "Last Month" | "3 Months Ago" | null;

// export function categorizeDate(isoDateStr: string): MonthCategory {
//   const inputDate = new Date(isoDateStr);
//   if (isNaN(inputDate.getTime())) return null; // Invalid date

//   const now = new Date();

//   // Helper to get year-month key
//   const getMonthKey = (date: Date) => date.getFullYear() * 12 + date.getMonth();

//   const inputKey = getMonthKey(inputDate);
//   const currentKey = getMonthKey(now);

//   const diff = currentKey - inputKey;

//   if (diff === 0) return "This Month";
//   if (diff === 1) return "Last Month";
//   if (diff === 3) return "3 Months Ago";

//   return null;
// }

// export function isWithin4Hours(date1: Date, date2: Date) {
//   const time1 = date1.getTime(); // Timestamp in ms
//   const time2 = date2.getTime();

//   return Math.abs(time1 - time2) <= 4 * 3600 * 1000;
// }

// export function isAtLeastNDaysAfter(base: Date, compare: Date, days: number) {
//   const diffInMs = compare.getTime() - base.getTime();

//   const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

//   return diffInDays >= days;
// }

// export function isAtLeastNDaysBefore(base: Date, compare: Date, days: number) {
//   const diffInMs = base.getTime() - compare.getTime(); // Swapped order

//   const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

//   return diffInDays >= days;
// }

// export function formatDateToDDMMYYYY(date: Date): string {
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// }

// export function toMidnight(date: Date) {
//   const midnight = new Date(date); // create a copy so we don't mutate the original
//   midnight.setHours(0, 0, 0, 0);
//   return midnight;
// }

// export function redactString(value: string, lettersToRedact: number) {
//   if (lettersToRedact <= 0) return value; // No redaction needed
//   if (lettersToRedact >= value.length) return '*'.repeat(value.length); // Fully redact

//   const redactedPart = '*'.repeat(lettersToRedact);
//   const remainingPart = value.slice(lettersToRedact);
//   return redactedPart + remainingPart;
// }

// export function getDateOneWeekBeforeIfMonth(start: Date, end: Date): Date | null {
//   const msInDay = 1000 * 60 * 60 * 24;
//   const diffInDays = (new Date(end).getTime() - new Date(start).getTime()) / msInDay;

//   if (diffInDays >= 14) { // about 1 month
//     const result = new Date(end);
//     result.setDate(result.getDate() - 7); // 1 week before
//     return result;
//   }

//   return null;
// }

// export function getDateBefore(end: Date, daysBefore: number): Date {
//   const result = new Date(end);
//   result.setDate(result.getDate() - daysBefore);
//   return result;
// }

// export function getDaysBetween(start: Date, end: Date): number {
//   const msInDay = 1000 * 60 * 60 * 24;
//   const diffMs = new Date(end).getTime() - new Date(start).getTime();
//   return Math.ceil(diffMs / msInDay);   // or use Math.floor if you don't want to count partial days
// }

// export function encodeUUIDToBase64(uuid: string) {
//   // Remove dashes, convert hex to bytes
//   const bytes = Buffer.from(uuid.replace(/-/g, ""), "hex");
//   // Base64 encode and strip trailing "=" padding
//   return bytes.toString("base64url").replace(/=+$/, "");
// }

// export function decodeUUIDFromBase64(short: string) {
//   // Restore padding to multiple of 4
//   const padded = short + "==".slice((short.length % 4) || 2);
//   const bytes = Buffer.from(padded, "base64");
//   const hex = bytes.toString("hex");
//   // Add UUID dashes back in
//   return [
//     hex.slice(0, 8),
//     hex.slice(8, 12),
//     hex.slice(12, 16),
//     hex.slice(16, 20),
//     hex.slice(20)
//   ].join("-");
// }


// export function convertNaira(amount: number): string {
//   const naira = Math.floor(amount);
//   const kobo = Math.round((amount - naira) * 100);

//   const nairaWords = toWords(naira);
//   let result = `${capitalize(nairaWords)} Naira`;

//   if (kobo > 0) {
//     const koboWords = toWords(kobo);
//     result += ` and ${capitalize(koboWords)} Kobo`;
//   }

//   return result + " Only";
// }

// function capitalize(str: string) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

// /* export function generateFilenameForUpload(originalname: string) {
//   const decodedFileName = normalizeFileName(originalname);

//   const uniqueFileName = `${uuidv4()}-${decodedFileName}`; // Unique name to prevent overwrites

//   return uniqueFileName;
// } */

// export function clamp(value: number, min: number, max: number) {
//   return Math.min(Math.max(value, min), max);
// }
