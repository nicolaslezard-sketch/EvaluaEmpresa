import { type NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { email: user.email },
      });

      return true;
    },

    async jwt({ token, user }) {
      // refrescar id + plan cada 5 min (clave para upgrades/downgrades por webhook)
      const shouldRefresh =
        !!user?.email ||
        !token.planCheckedAt ||
        Date.now() - token.planCheckedAt > 5 * 60 * 1000;

      if (shouldRefresh) {
        const email = user?.email ?? (token.email as string | undefined);
        if (email) {
          const dbUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, plan: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.plan = (dbUser.plan as any) ?? "free";
            token.planCheckedAt = Date.now();
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = (token.plan as any) ?? "free";
      }
      return session;
    },
  },
};
