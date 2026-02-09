import OpenAI from "openai";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta env ${name}`);
  return v;
}

export const openai = new OpenAI({
  apiKey: requireEnv("OPENAI_API_KEY"),
});
