import { Request, Response } from "express"
import { handleError } from "../utils/handleError.js"
import { PDFService } from "../services/pdf-parser.service.js"

export const PDFController = {
  async handleAnalyzePDF(req: Request, res: Response) {
    try {
      const file = req.file

      if (!file) {
        res.status(400).json({ message: "please provide a file for parsing" })

        return;
      }

      const processedPDF = await PDFService.summarizer.processPDF(file.buffer, file.originalname)

      const data = await PDFService.summarizer.summarizePDF(processedPDF.docId, "general")

      res.status(200).json({ message: "success", data: data })
    }
    catch (error) {
      handleError(res, error)
    }
  },
}