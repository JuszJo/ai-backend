import { Request, Response } from "express"
import { handleError } from "../utils/handleError.js"
import { ChatService } from "../services/chat.service.js"

function resSafeError(message: string, code: number, res: Response) {
  res.status(code).json({ message });
}

export async function streamToClient(stream: AsyncGenerator<string>, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    for await (const chunk of stream) {
      res.write(chunk);
    }
  } finally {
    res.end();
  }
}

export const ChatController = {
  async handleChat(req: Request, res: Response) {
    const { question, stream } = req.body;

    if (!question) {
      resSafeError("Please enter a question", 400, res);

      return;
    }

    if (typeof question != "string") {
      resSafeError("Question should be a type of 'string'", 400, res);

      return;
    }

    try {
      const data = await ChatService.AI.chat(question, stream);

      if (stream) {
        streamToClient(data as AsyncGenerator<string>, res);
      }


      res.status(200).json({ message: "success", data: data })
    }
    catch (error) {
      handleError(res, error)
    }
  },
}