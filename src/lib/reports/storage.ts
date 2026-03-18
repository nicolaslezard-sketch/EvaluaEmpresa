import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "@/lib/r2";

function getBucketName() {
  const bucket = process.env.R2_BUCKET;

  if (!bucket) {
    throw new Error("Missing env: R2_BUCKET");
  }

  return bucket;
}

export function pdfKeyForEvaluation(evaluationId: string) {
  return `reports/${evaluationId}.pdf`;
}

export async function uploadEvaluationPdf(
  evaluationId: string,
  buffer: Buffer,
) {
  const r2 = getR2Client();
  const bucket = getBucketName();
  const key = pdfKeyForEvaluation(evaluationId);

  console.log("EE uploadEvaluationPdf", {
    bucket,
    key,
    size: buffer.length,
  });

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: "application/pdf",
      CacheControl: "private, max-age=31536000, immutable",
    }),
  );

  return { key, size: buffer.length, mime: "application/pdf" as const };
}

export async function getEvaluationPdfObject(key: string) {
  const r2 = getR2Client();
  const bucket = getBucketName();

  console.log("EE getEvaluationPdfObject", {
    bucket,
    key,
  });

  return r2.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}
