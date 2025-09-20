export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choice[];
  usage: Usage;
  service_tier: string;
}

interface Choice {
  index: number;
  message: {
    role: "assistant" | "user" | "system";
    content: string;
    refusal: string | null;
    annotations: any[]; // can be made stricter if you know the shape
  };
  logprobs: null | object;
  finish_reason: string;
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_tokens_details: TokenDetails;
  completion_tokens_details: TokenDetails & {
    reasoning_tokens: number;
    accepted_prediction_tokens: number;
    rejected_prediction_tokens: number;
  };
}

interface TokenDetails {
  cached_tokens: number;
  audio_tokens: number;
}