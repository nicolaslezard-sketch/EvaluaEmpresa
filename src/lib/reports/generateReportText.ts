import OpenAI from "openai";

export async function generateReportText(formData: unknown): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
Sos un analista de riesgo empresarial en Argentina.
El informe es ORIENTATIVO, no legal ni contable.

Datos:
${JSON.stringify(formData, null, 2)}

Devolvé un informe claro, profesional y estructurado.
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return res.choices[0].message.content || "";
}
