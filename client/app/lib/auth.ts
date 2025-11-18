import type { NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import axios from 'axios';
import { createUser } from "../service/user-service";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile?.email) {
        try {
          const response = await createUser(
            {
              username: profile.name,
              email: profile.email,
            }
          );
          token.id = response?.user?._id;
          token.sessionId = response?.user?.sessionId
        } catch (e) {
          console.error('Erro ao criar/buscar usuário:', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id && token.sessionId) {
        (session.user as any).id = token.id;
        (session.user as any).sessionId = token.sessionId;
      }
      return session;
    },
  },
}