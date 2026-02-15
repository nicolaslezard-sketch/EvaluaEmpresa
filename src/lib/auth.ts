// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // ✅ Database sessions (estable en Vercel + Prisma)
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // refresca cada 24h
  },

  providers: [
    GoogleProvider({
      clientId: mustEnv("GOOGLE_CLIENT_ID"),
      clientSecret: mustEnv("GOOGLE_CLIENT_SECRET"),
      allowDangerousEmailAccountLinking: false,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    // ✅ Lo único que vale la pena acá con database sessions:
    // asegurar session.user.id tipado y disponible.
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // ✅ Secret estable (NO lo cambies nunca más)
  secret: mustEnv("NEXTAUTH_SECRET"),

  debug: process.env.NODE_ENV === "development",
};
