import { createClient } from "contentful";

// Validate required environment variables at startup.
// This gives a clear error message instead of the cryptic
// "Expected parameter accessToken" from the Contentful SDK.
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error(
    `Missing Contentful credentials.\n` +
    `Create a .env.local file in the project root with:\n\n` +
    `  CONTENTFUL_SPACE_ID=your_space_id\n` +
    `  CONTENTFUL_ACCESS_TOKEN=your_access_token\n\n` +
    `You can find these in your Contentful space under Settings → API keys.`
  );
}

const client = createClient({ space: spaceId, accessToken });

export default client;
