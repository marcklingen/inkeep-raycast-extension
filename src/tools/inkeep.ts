import { getInkeepCompletion } from "../services/inkeep";

type Input = {
  /** Question to ask Inkeep */
  query: string;
};

export default async function (input: Input): Promise<string> {
  try {
    // Call the Inkeep API
    return await getInkeepCompletion(input.query);
  } catch (error) {
    console.error("Error in AI tool:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
