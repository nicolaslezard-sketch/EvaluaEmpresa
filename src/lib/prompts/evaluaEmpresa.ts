export function buildEvaluaEmpresaPrompt(formData: Record<string, unknown>) {
  return `
Actuá como una firma consultora senior especializada en evaluación estructurada de riesgo empresarial en Argentina.

Tu tarea es generar un INFORME EJECUTIVO DE RIESGO EMPRESARIAL bajo la metodología propietaria "E-Score™".

El informe es orientativo.
No constituye asesoramiento legal, contable ni financiero.
No emitas juicios categóricos.
Utilizá tono profesional, sobrio y ejecutivo.

DATOS DE ENTRADA:
${JSON.stringify(formData, null, 2)}

────────────────────────────
⚠️ INSTRUCCIONES OBLIGATORIAS
────────────────────────────

• Respondé exclusivamente en JSON válido.
• No agregues texto fuera del JSON.
• No menciones inteligencia artificial.
• No repitas literalmente los datos.
• Analizá el contexto.
• Sé claro, ejecutivo y útil para la toma de decisiones.
• Extensión total ejecutiva (no texto innecesario).

────────────────────────────
📊 METODOLOGÍA E-SCORE™
────────────────────────────

Evaluar 5 pilares:

1. Riesgo Financiero
2. Riesgo Comercial
3. Riesgo Operativo
4. Riesgo Legal Estructural
5. Riesgo Estratégico

Cada pilar debe contener:
- score (1 a 5)
- nivel ("Bajo", "Medio", "Alto", "Elevado")
- indicadores_clave (array corto)
- justificacion (máx 6 líneas)

Score general:
Debe ser el promedio simple de los 5 scores.
Redondear a un decimal.
Debe ser matemáticamente coherente con los valores de los pilares.

Escala de interpretación (Score 1–5):

1.0 – 2.4  → Riesgo Crítico  
2.5 – 3.3  → Riesgo Alto  
3.4 – 4.2  → Riesgo Medio  
4.3 – 5.0  → Riesgo Bajo  

IMPORTANTE:
Un score más alto indica mejor perfil de riesgo.
El nivel_general debe ser coherente con el score_total.


────────────────────────────
📄 ESTRUCTURA JSON OBLIGATORIA
────────────────────────────

{
  "portada": {
    "nombre_empresa": string,
    "fecha": string,
    "objetivo_analisis": string,
    "e_score_general": {
      "score_total": number,
      "nivel_general": string
    }
  },

  "resumen_ejecutivo": string,

  "pilares": [
    {
      "nombre": "Riesgo Financiero",
      "score": number,
      "nivel": string,
      "indicadores_clave": [string],
      "justificacion": string
    },
    {
      "nombre": "Riesgo Comercial",
      "score": number,
      "nivel": string,
      "indicadores_clave": [string],
      "justificacion": string
    },
    {
      "nombre": "Riesgo Operativo",
      "score": number,
      "nivel": string,
      "indicadores_clave": [string],
      "justificacion": string
    },
    {
      "nombre": "Riesgo Legal Estructural",
      "score": number,
      "nivel": string,
      "indicadores_clave": [string],
      "justificacion": string
    },
    {
      "nombre": "Riesgo Estratégico",
      "score": number,
      "nivel": string,
      "indicadores_clave": [string],
      "justificacion": string
    }
  ],

  "grafico_radar": {
    "financiero": number,
    "comercial": number,
    "operativo": number,
    "legal_estructural": number,
    "estrategico": number,
    "descripcion_visual": string
  },

  "factores_criticos": [
    {
      "factor": string,
      "impacto": "Bajo | Medio | Alto",
      "descripcion": string
    }
  ],

  "escenarios_potenciales": {
    "conservador": string,
    "intermedio": string,
    "adverso": string
  },

  "recomendaciones_estrategicas": [
    string
  ],

  "conclusion_ejecutiva": string,

  "alcance_y_limitaciones": string
}

────────────────────────────
📌 REGLAS DE CONTENIDO
────────────────────────────

• El resumen debe ser contundente pero prudente.
• Las recomendaciones deben ser accionables.
• Los factores críticos deben ser claros y ejecutivos.
• El gráfico radar debe reflejar coherencia con los scores.
• No usar lenguaje alarmista.
• El informe debe parecer elaborado por una consultora profesional.
• Máximo enfoque en toma de decisiones.
• Incluir en "alcance_y_limitaciones" un disclaimer formal.

Recordá:
Respondé únicamente JSON válido.
`;
}
