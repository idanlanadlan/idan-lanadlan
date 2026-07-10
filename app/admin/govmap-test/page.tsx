import GovMapTestClient from "./GovMapTestClient";

// Temporary discovery page for the GovMap integration (Phase 0).
// Verifies: jQuery requirement, coordinate format, searchAndLocate without a
// map, token validity per domain, and layer IDs. Delete when Phase 3 ships.
export default function GovMapTestPage() {
  return <GovMapTestClient />;
}
