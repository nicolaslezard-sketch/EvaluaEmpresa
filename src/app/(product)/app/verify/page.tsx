"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [formalId, setFormalId] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function handleVerify() {
    const res = await fetch("/api/verify", {
      method: "POST",
      body: JSON.stringify({ formalId, code }),
    });

    const data = await res.json();

    if (data.valid) {
      setResult(`Documento válido — Emitido el ${data.date}`);
    } else {
      setResult("Registro no válido");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold">Verificación de Informe</h1>

        <input
          className="w-full border p-2"
          placeholder="EE-2026-02-001"
          value={formalId}
          onChange={(e) => setFormalId(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-black text-white py-2"
        >
          Verificar
        </button>

        {result && <p className="text-sm">{result}</p>}
      </div>
    </div>
  );
}
