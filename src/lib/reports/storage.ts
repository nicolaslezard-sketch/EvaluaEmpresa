import { r2 } from "@/lib/r2";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const BUCKET = process.env.R2_BUCKET!;

export function pdfKeyForEvaluation(evaluationId: string) {
  return `reports/${evaluationId}.pdf`;
}

export async function uploadEvaluationPdf(
  evaluationId: string,
  buffer: Buffer,
) {
  const key = pdfKeyForEvaluation(evaluationId);

  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
      CacheControl: "private, max-age=31536000, immutable",
    }),
  );

  return { key, size: buffer.length, mime: "application/pdf" as const };
}

export async function getEvaluationPdfObject(key: string) {
  return r2.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
}
