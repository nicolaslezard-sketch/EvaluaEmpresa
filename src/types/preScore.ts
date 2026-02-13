export type PreScore = {
  overallScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  pillarScores: {
    financial: number;
    commercial: number;
    operational: number;
    legal: number;
    strategic: number;
  };
  oneStrength: string;
  oneWeakness: string;
};
