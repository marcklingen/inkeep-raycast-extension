import axios from "axios";
import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  apiKey: string;
  model: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// This interface is used for type checking when building the request
export interface InkeepCompletionRequest {
  model: string;
  messages: Message[];
  stream?: boolean;
}

interface InkeepCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function getInkeepCompletion(prompt: string): Promise<string> {
  const preferences = getPreferenceValues<Preferences>();

  try {
    const response = await axios.post<InkeepCompletionResponse>(
      "https://api.inkeep.com/v1/chat/completions",
      {
        model: preferences.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${preferences.apiKey}`,
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(`Inkeep API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching completion: ${errorMessage}`);
  }
}
