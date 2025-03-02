import { Detail, Form, ActionPanel, Action, showToast, Toast, LaunchProps } from "@raycast/api";
import { useState, useEffect } from "react";
import { streamInkeepCompletion } from "./services/inkeep";

interface CommandArguments {
  prompt?: string;
}

export default function Command(props: LaunchProps<{ arguments: CommandArguments }>) {
  const { prompt: initialPrompt } = props.arguments;
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const [showForm, setShowForm] = useState(!initialPrompt?.trim());

  // Process the initial prompt if provided as an argument
  useEffect(() => {
    if (initialPrompt?.trim()) {
      handlePromptSubmission(initialPrompt);
    }
  }, [initialPrompt]);

  async function handlePromptSubmission(prompt: string) {
    if (!prompt.trim()) {
      showToast({
        style: Toast.Style.Failure,
        title: "Please enter a prompt",
      });
      return;
    }

    setIsLoading(true);
    setIsStreaming(true);
    setStreamedResponse("");

    try {
      // Use streaming API
      await streamInkeepCompletion(
        prompt,
        (chunk) => {
          setStreamedResponse((prev) => prev + chunk);
        },
        (fullResponse) => {
          setResponse(fullResponse);
          setIsStreaming(false);
        },
      );
    } catch (error) {
      console.error("Error:", error);
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: error instanceof Error ? error.message : String(error),
      });
      // If there's an error and we came from an argument, show the form
      if (!showForm) {
        setShowForm(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(values: { prompt: string }) {
    await handlePromptSubmission(values.prompt);
  }

  // Show final response if we have one
  if (response) {
    return (
      <Detail
        markdown={response}
        actions={
          <ActionPanel>
            <Action
              title="Ask Another Question"
              onAction={() => {
                setResponse(null);
                setStreamedResponse("");
                setShowForm(true);
              }}
            />
            <Action.CopyToClipboard title="Copy Response" content={response} />
          </ActionPanel>
        }
      />
    );
  }

  // Show streaming response if we're streaming
  if (isStreaming) {
    return (
      <Detail
        isLoading={isLoading}
        markdown={streamedResponse || "Loading response from Inkeep..."}
        actions={
          <ActionPanel>
            <Action
              title="Cancel"
              onAction={() => {
                setIsStreaming(false);
                setShowForm(true);
              }}
            />
          </ActionPanel>
        }
      />
    );
  }

  // Show loading state in Detail view if we're processing an argument
  if (isLoading && !showForm) {
    return <Detail isLoading={true} markdown="Loading response from Inkeep..." />;
  }

  // Show form as fallback or if user wants to ask another question
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
