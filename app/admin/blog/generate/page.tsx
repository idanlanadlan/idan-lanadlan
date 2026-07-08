import GenerateClient from "./GenerateClient";

// Article generation (claude-opus-4-8, max_tokens 4096) can take longer than
// the platform's default Server Action timeout — raise it for this page.
export const maxDuration = 60;

export default function GenerateBlogPage() {
  return <GenerateClient />;
}
