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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?email=${credentials?.email}`,
            {
              method: "GET",
            }
          );
          const user = await request.json();
          const data = user.data;
          console.log(data);
          if (data) {
            console.log(credentials)
            console.log(JSON.stringify({
                  email: credentials?.email,
                  password: credentials?.password,
                }),)
            const req = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: credentials?.email,
                  password: credentials?.password,
                }),
              }
            );
            console.log(await req.json());
            if (req.ok) {
              return data;
            } else {
              throw new Error("Please Check The Password");
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
      console.log(user)
      if (!user?.email) return false;
      if(account?.provider == 'google'){
        try {
          console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                username: user.name,
              }),
            }
          );
          const result = await res.json();
          console.log(result);
          if (res.ok) {
            return true;
          }
  
          if (res.status === 404) {
            const registerRes = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                  username: user.name,
                }),
              }
            );
  
            if (registerRes.ok) return true;
            else return false;
          }
  
          return false;
        } catch (err) {
          console.error("Error in signIn callback:", err);
          return false;
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.email = user.email;
      }
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
