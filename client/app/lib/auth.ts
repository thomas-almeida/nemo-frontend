import type { NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import { createUser } from "@/app/service/user-service";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await createUser({
          email: user.email,
          username: user.name,
        });
        user.id = res.data.user._id;
      } catch (e) {
        // fallback: não impede login
      }
      return true;
    },
    async jwt({ token, user }) {
      // Adiciona _id ao token
      if (user && (user as any).id) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      // inclui _id na sessão
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
}
