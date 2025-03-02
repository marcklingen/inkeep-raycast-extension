# Inkeep Raycast Extension

A Raycast extension for interacting with the Inkeep Completions API. This extension allows you to ask questions and get AI-powered answers from your knowledge base.

## Features

- Ask questions to Inkeep and get AI-powered answers
- Configure the model to use (e.g., inkeep-qa-sonnet-3-5, inkeep-qa-gpt-4o)
- Copy responses to clipboard
- Use as an AI tool in Raycast
- Compatible with Raycast's AI Extension framework

## Setup

1. Install the extension
2. Configure your Inkeep API key in the extension preferences
3. Configure the model to use (default: inkeep-qa-sonnet-3-5)

## Usage

### Command: Ask Inkeep

1. Open Raycast
2. Type "Ask Inkeep"
3. Enter your question
4. Press Enter to submit

### AI Tool: Ask Inkeep

You can also use the Inkeep extension as an AI tool in Raycast:

1. In any Raycast command, use the AI tool
2. Type "Ask Inkeep: [your question]"
3. The response will be displayed in the AI tool results

Examples:

- "Ask Inkeep: How do I install the SDK?"
- "Ask Inkeep: What are the API rate limits?"
- "Ask Inkeep: How to configure authentication?"

## API Key

To get an API key:

1. Log in to the Inkeep Dashboard
2. Navigate to the **Projects** section and select your project
3. Open the **Integrations** tab
4. Click **Create Integration** and choose **API** from the options
5. Enter a Name for your new API integration
6. Click on **Create**
7. Use the generated **API key** in the extension preferences

## Models

The extension supports various Inkeep models:

- `inkeep-qa-sonnet-3-5` (recommended)
- `inkeep-qa-gpt-4o`
- `inkeep-qa-gpt-4-turbo`
- `inkeep-context-sonnet-3-5`
- `inkeep-context-gpt-4-turbo`
- `inkeep-context-gpt-4o`

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
