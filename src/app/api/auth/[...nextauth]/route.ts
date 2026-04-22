import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/lib/db/auth';
import { checkAndSyncProStatus } from '@/lib/db/user';

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
          if (!response.success) {
            console.log(response.message);
            return null;
          }

          const user = response.user;

          // If the user has a Stripe subscription on record, verify it is still
          // active. This ensures the session always reflects the real Pro status
          // even if a webhook was missed or the trial expired since last login.
          if (user.stripe_id && user.subscription_id) {
            user.level = await checkAndSyncProStatus(
              user.id,
              user.stripe_id,
              user.subscription_id,
              user.level,
            );
          }

          return { ...user, auth_token: '' };
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
