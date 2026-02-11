export function safeJsonParse(input: string): unknown {
  const raw = input.trim();

  // elimina fences tipo ```json ... ```
  const unfenced = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(unfenced);
}
