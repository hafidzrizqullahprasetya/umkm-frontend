import { NextAuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        if (credentials === null) {
          return null;
        }
        try {
          const request = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/check?email=${credentials?.email}`,
            {
              method: "GET",
            }
          );
          const result = await request.json();
          console.log(result);
          if (result.data && result.data.exists) {
            console.log(credentials);
            const req = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
              {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: credentials?.email,
                  password: credentials?.password,
                }),
              }
            );
            const loginResult = await req.json();
            console.log(loginResult);
            if (req.ok && loginResult.data) {
              return {
                id: loginResult.data.id.toString(),
                email: loginResult.data.email,
                name: loginResult.data.username,
                role: loginResult.data.role,
                address: loginResult.data.address,
                accessToken: loginResult.data.token,
              };
            } else {
              throw new Error(loginResult.message || "Please Check The Password");
            }
          } else {
            throw new Error("Please Register The Email First");
          }
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback triggered");
      console.log(user);
      if (!user?.email) return false;
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        // Untuk Google OAuth
        const fetching = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            username: user.name
          }),
        });
        const result = await fetching.json();
        token.accessToken = result.data.token
        
        if (fetching.ok && result.data) {
          console.log("Google OAuth login successful:", result);
          token.role = result.data.role;
          token.accessToken = result.data.token;
          token.email = user.email;
          token.name = user.name;
          token.address = result.data.address;
        }
        return token;
      }
      
      if (user) {
        // Untuk Credentials provider - user sudah berisi semua data dari authorize
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
        token.address = (user as any).address;
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token data ke session
      session.accessToken = token.accessToken
      session.accessToken = token.accessToken as string;

      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).name = token.name;
        (session.user as any).email = token.email;
        (session.user as any).address = token.address;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/home";
    },
  },
  pages: {
    signIn: "/login",
  },
};
