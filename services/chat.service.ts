import { ChatCompletion } from "openai/resources.js";
import { OR_API_KEY } from "../config/openrouter.config.js";
import { SystemPrompt } from "../sys/system.prompt.js";

async function handleLLMResponse(response: Response, stream: boolean): Promise<ChatCompletion | AsyncGenerator<string>> {
  if (!stream) {
    return (await response.json()) as ChatCompletion;
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  async function* streamGenerator() {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  }

  return streamGenerator();
}

class ChatAI {
  llmEndpoint: string;
  model: string;

  constructor(llmEndpoint = "http://127.0.0.1:8080", model = "deepseek/deepseek-chat-v3.1:free") {
    this.llmEndpoint = llmEndpoint;
    this.model = model;
  }

  async chat(input?: string, stream = false) {
    const body = {
      model: this.model,
      messages: [
        {
          role: "system",
          content: SystemPrompt.rebellion
        },
        {
          role: "user",
          content: input || "What is the meaning of life, is it livable?"
        }
      ]
    }

    const response = await fetch(this.llmEndpoint + "/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OR_API_KEY}`,
        "Content-type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Response error ${response.status}, ${response.statusText}`)
    }

    return handleLLMResponse(response, stream);

    // const data = await response.json() as ChatCompletion;

    // console.log(data.choices[0].message);

    // return data;
  }
}

export const ChatService = {
  AI: new ChatAI("https://openrouter.ai")
}