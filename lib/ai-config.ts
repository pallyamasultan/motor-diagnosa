import { google } from "@ai-sdk/google";

export const getModels = () => {
  const primaryModelName = process.env.GEMINI_MODEL || "";
  const fallbackModelName = process.env.GEMINI_FALLBACK_MODEL || "";

  // We return models even if names are empty strings to avoid crashing build.
  // The route will check for the existence of env vars before calling these.
  return {
    primaryModel: google(primaryModelName),
    fallbackModel: google(fallbackModelName),
  };
};
