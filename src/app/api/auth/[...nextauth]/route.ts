import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/lib/db/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'text' },
        password: { type: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const response = await login(credentials.email, credentials.password);
          if (response.success) {
            return { ...response.user, auth_token: '' };
          }
          console.log(response.message);
          return null;
        } catch (error: any) {
          console.log(error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }: any) => {
      if (token.sign_out) {
        return {};
      } else {
        return { ...session, user: token.user };
      }
    },
    jwt: async ({ token, trigger, session, user }: any) => {
      const isSignIn = user ? true : false;
      // console.log(token, trigger, session, user);
      
      if (isSignIn) {
        token.sign_out = false;
        token.user = user;
      }

      if (trigger === 'update') {
        if (session?.sign_out) {
          token.sign_out = true;         
        } else {
          token.sign_out = false;
        }

        if (session) {
          token.user = session.user;
        }
      }

      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.NEXT_PUBLIC_JWT_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
