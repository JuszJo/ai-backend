// import { NextFunction, Request, Response } from "express";

// export function isLandlord(req: Request, res: Response, next: NextFunction) {
//     if (req.user.role != "landlord") {
//         if(req.user.role != "user") {
//             res.status(401).json({ message: "unauthorized" });

//             return;
//         }        
//     }

//     next()
// }

// export function isTenant(req: Request, res: Response, next: NextFunction) {
//     if (req.user.role != "tenant") {
//         res.status(401).json({ message: "unauthorized" });

//         return;
//     }

//     next()
// }