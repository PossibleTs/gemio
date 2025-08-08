import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error('Credenciais invalidas!');

        const data = {
          usr_email: credentials.email,
          usr_password: credentials.password,
        };

        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_API_URL + 'auth/login',
          {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const user = await res.json();

        if (res.status !== 200) throw new Error(user.message);

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session  }) {
      
      if (trigger === "update" && session?.user) {
        token.user = {
          ...(token.user as Record<string, unknown>),
          ...(session.user as Record<string, unknown>),
        };
      }

      if (user) {
        // User is available during sign-in
        token.user = user;
      }

      return token;
    },
    session({ session, token }) {
      if (!token.user) return session;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token.user as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
