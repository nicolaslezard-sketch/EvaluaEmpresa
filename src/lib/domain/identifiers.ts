import { prisma } from "@/lib/prisma";

function pad(num: number, size: number) {
  return num.toString().padStart(size, "0");
}

export async function generateFormalId(companyId: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1, 2);

  const count = await prisma.reportRequest.count({
    where: {
      companyId,
      status: "DELIVERED",
    },
  });

  const sequence = pad(count + 1, 3);

  return `EE-${year}-${month}-${sequence}`;
}

export function generateVerifyCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 10; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}
