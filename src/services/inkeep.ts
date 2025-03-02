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

interface StreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
  }[];
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

export async function streamInkeepCompletion(
  prompt: string,
  onChunk: (chunk: string) => void,
  onComplete: (fullResponse: string) => void,
): Promise<void> {
  const preferences = getPreferenceValues<Preferences>();
  let fullResponse = "";

  try {
    const response = await axios.post(
      "https://api.inkeep.com/v1/chat/completions",
      {
        model: preferences.model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${preferences.apiKey}`,
        },
        responseType: "stream",
      },
    );

    const stream = response.data;
    let buffer = "";

    stream.on("data", (chunk: Buffer) => {
      const chunkStr = chunk.toString();
      buffer += chunkStr;

      // Process complete lines
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        if (line.trim() === "") continue;
        if (line.trim() === "data: [DONE]") continue;

        try {
          // Remove the "data: " prefix
          const jsonStr = line.replace(/^data: /, "").trim();
          const data = JSON.parse(jsonStr) as StreamChunk;

          if (data.choices && data.choices.length > 0) {
            const content = data.choices[0].delta.content || "";
            fullResponse += content;
            onChunk(content);
          }
        } catch (e) {
          console.error("Error parsing stream chunk:", e, line);
        }
      }
    });

    stream.on("end", () => {
      onComplete(fullResponse);
    });

    stream.on("error", (err: Error) => {
      console.error("Stream error:", err);
      throw err;
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(`Inkeep API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Error fetching completion: ${errorMessage}`);
  }
}
