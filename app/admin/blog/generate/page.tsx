import GenerateClient from "./GenerateClient";

// Article generation (max_tokens 4096) can take longer than the platform's
// default Server Action timeout — raise it for this page.
export const maxDuration = 120;

export default function GenerateBlogPage() {
  return <GenerateClient />;
}
