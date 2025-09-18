// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { supabase } from "../config/supabase.config.js";

// export type SupabaseUploadFileError = {
//   statusCode: string,
//   error: string,
//   message: string
// }

// type UploadSuccess = {
//   success: boolean,
//   url: string
// }

// export function isTypeError(error: unknown): error is TypeError {
//   return (
//     error instanceof TypeError ||
//     (typeof error === 'object' &&
//       error !== null &&
//       'name' in error && (error as Error).name === 'TypeError' &&
//       'message' in error && typeof (error as Error).message === 'string')
//   );
// }

// export function isUploadFileError(error: unknown): error is SupabaseUploadFileError {
//   // Type guard function
//   return (
//     typeof error === 'object' &&
//     error !== null &&
//     'statusCode' in error && typeof (error as SupabaseUploadFileError).statusCode === 'string' &&
//     'error' in error && typeof (error as SupabaseUploadFileError).error === 'string' &&
//     'message' in error && typeof (error as SupabaseUploadFileError).message === 'string'
//   );
// }

export function normalizeFileName(fileName: string): string {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")          // replace spaces with _
    .replace(/[^\w.-]/g, "");      // remove non-alphanumeric except _ . -
}


// export async function uploadFile(file: Buffer, fileName: string, folderPath: string, bucketName: string) {
//   try {
//     // console.log("1. Input fileName:", fileName);
//     const decodedFileName = normalizeFileName(fileName); // Decode first

//     const uniqueFileName = `${uuidv4()}-${decodedFileName}`; // Unique name to prevent overwrites
//     // console.log("2. uniqueFileName:", uniqueFileName);

//     const fullPath = path.posix.join(folderPath, uniqueFileName);
//     // console.log("3. fullPath:", fullPath);

//     const { data, error } = await supabase.storage
//       .from(bucketName)
//       .upload(fullPath, file, {
//         cacheControl: "3600",
//         contentType: "application/octet-stream", // Auto-detects based on file type,
//       });

//     if (error) throw error;

//     // Get public URL
//     const { data: publicURL } = supabase.storage.from(bucketName).getPublicUrl(fullPath);
//     // console.log("4. Final publicUrl:", publicURL.publicUrl);

//     return { success: true, url: publicURL.publicUrl } as UploadSuccess;
//   }
//   catch (error) {
//     console.error("Upload failed:", error);

//     throw error;
//   }
// };

// /**
//  * @returns {Promise<string>} full path of the uploaded file
//  */
// export async function uploadFileV2(file: Buffer, fileName: string, folderPath: string, bucketName: string) {
//   try {
//     const uniqueFileName = `${uuidv4()}-${fileName}`; // Unique name to prevent overwrites

//     const fullPath = path.posix.join(folderPath, uniqueFileName);

//     const { data, error } = await supabase.storage
//       .from(bucketName)
//       .upload(fullPath, file, {
//         cacheControl: "3600",
//         contentType: "application/octet-stream", // Auto-detects based on file type,
//       });

//     if (error) throw error;

//     return fullPath
//   }
//   catch (error) {
//     console.error("Upload failed:", error);

//     throw error;
//   }
// };

// type GetSignedSuccess = {
//   success: boolean,
//   url: string
// }

// /**
//  * 
//  * @param bucketName bucket name
//  * @param fullPath full path of the file
//  * @param expiresIn seconds to expiry, defaults to `3600`
//  * @returns
//  */

// export async function getPrivateFileURL(bucketName: string, fullPath: string, expiresIn: number = 60 * 60) {
//   try {
//     const { data } = await supabase.storage.from(bucketName).createSignedUrl(fullPath, expiresIn);

//     if (!data) {
//       throw new Error("Can't create signed url");
//     }

//     return { success: true, url: data.signedUrl } as GetSignedSuccess;
//   }
//   catch (error) {
//     console.log(error);

//     throw error;
//   }
// }

// export async function deleteFileFromSupabase(publicUrl: string, bucketName: string) {
//   try {
//     const url = new URL(publicUrl);
//     const pathParts = url.pathname.split("/");
//     const bucketIndex = pathParts.indexOf(bucketName);

//     if (bucketIndex === -1) {
//       throw new Error("Bucket name not found in URL");
//     }

//     const filePath = pathParts.slice(bucketIndex + 1).join("/");

//     const { error } = await supabase.storage
//       .from(bucketName)
//       .remove([filePath]);

//     if (error) {
//       throw error;
//     }

//     return true;
//   }
//   catch (error) {
//     console.error("Error deleting file from Supabase:", error);

//     throw error;
//   }
// }
