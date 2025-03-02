import { Detail, Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { getInkeepCompletion } from "./services/inkeep";

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  async function handleSubmit(values: { prompt: string }) {
    if (!values.prompt.trim()) {
      showToast({
        style: Toast.Style.Failure,
        title: "Please enter a prompt",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await getInkeepCompletion(values.prompt);
      setResponse(result);
    } catch (error) {
      console.error("Error:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (response) {
    return (
      <Detail
        markdown={response}
        actions={
          <ActionPanel>
            <Action title="Ask Another Question" onAction={() => setResponse(null)} />
            <Action.CopyToClipboard title="Copy Response" content={response} />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Ask Inkeep" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="prompt"
        title="Prompt"
        placeholder="What would you like to ask Inkeep?"
        enableMarkdown
        autoFocus
      />
    </Form>
  );
}
