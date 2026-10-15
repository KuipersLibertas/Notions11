import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login, getUserById } from '@/lib/db/auth';
import { checkAndSyncProStatus } from '@/lib/db/user';

const PWD_CHECK_INTERVAL_MS = 5 * 60 * 1000; // re-check password_version every 5 minutes

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

          return user;
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
      // Initial sign-in: populate the token from the authorised user object.
      if (user) {
        token.sign_out = false;
        token.user = user;
        token.pwdCheckAt = Date.now();
        return token;
      }

      // Client-triggered update (e.g. after logo upload/delete).
      // SECURITY: never accept privilege fields from the client — only the logo
      // URL may be updated this way. Level, stripe_id, subscription_id, balance,
      // and all other fields are immutable from the client side.
      if (trigger === 'update') {
        if (session?.sign_out) {
          token.sign_out = true;
        } else {
          token.sign_out = false;
          if (session?.user?.logo !== undefined) {
            token.user = { ...token.user, logo: session.user.logo };
          }
        }
        return token;
      }

      // Periodically verify that the session's password_version still matches the
      // database. If the user changed their password from another device, the DB
      // version will be higher than what is stored in this JWT, and we sign out.
      if (!token.sign_out && token.user?.id) {
        const now = Date.now();
        if (!token.pwdCheckAt || now - token.pwdCheckAt > PWD_CHECK_INTERVAL_MS) {
          token.pwdCheckAt = now;
          try {
            const dbUser = await getUserById(token.user.id);
            if (!dbUser || (dbUser.password_version ?? 1) !== (token.user.password_version ?? 1)) {
              token.sign_out = true;
            }
          } catch {
            // DB unreachable — let the session continue rather than locking everyone out
          }
        }
      }

      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  // SECURITY: NEXTAUTH_SECRET must be set as a server-only env var.
  // Never fall back to a NEXT_PUBLIC_ variable — those are embedded in the
  // client bundle and would expose the JWT signing key to any browser.
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
