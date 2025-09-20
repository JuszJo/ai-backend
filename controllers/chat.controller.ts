import { Request, Response } from "express"
import { handleError } from "../utils/handleError.js"
import { ChatService } from "../services/chat.service.js"

export const ChatController = {
  async handleChat(req: Request, res: Response) {
    try {
      const data = await ChatService.AI.chat()

      res.status(200).json({ message: "success", data: data })
    }
    catch (error) {
      handleError(res, error)
    }
  },
}