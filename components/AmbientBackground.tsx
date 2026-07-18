export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 ambient-glow"
      style={{ pointerEvents: "none" }}
    />
  );
}
