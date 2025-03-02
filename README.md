# Inkeep Raycast Extension

A Raycast extension for interacting with the Inkeep Completions API. This extension allows you to ask questions and get AI-powered answers from your knowledge base.

## Setup

1. Install the extension
2. Configure your Inkeep API key in the extension preferences
3. Optional: Configure model and API base URL

### API Key

To get an API key:

1. Log in to the Inkeep Dashboard
2. Navigate to the **Projects** section and select your project
3. Open the **Integrations** tab
4. Click **Create Integration** and choose **API** from the options
5. Enter a Name for your new API integration
6. Click on **Create**
7. Use the generated **API key** in the extension preferences

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

## TODO Before Submitting to Raycast Store

The following items need to be addressed before submitting this extension to the Raycast store:

3. **Date in Changelog**: Update the date in CHANGELOG.md to reflect the actual release date (currently shows 2024-06-01, which is in the future).

4. **Run Build and Lint**: Before submission, run `npm run build` and fix any linting issues with `npm run lint --fix`.

5. **Screenshots**: Consider adding screenshots to showcase your extension in the Raycast store. These can be added to the README.md file.

6. **Keywords**: Consider adding relevant keywords to the package.json to improve discoverability in the store.

7. **Test with Distribution Build**: Make sure to test the extension with the distribution build to ensure everything works as expected.
