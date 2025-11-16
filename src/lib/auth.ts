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
            console.log(
              JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              })
            );
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
            const loginResult = await req.json();
            console.log(loginResult);
            if (req.ok && loginResult.data) {
              // Return the user data including token and role
              return { ...loginResult.data };
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
      if (account?.provider == "google") {
        try {
          console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
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
          if (res.ok && result.data) {
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

            const registerResult = await registerRes.json();

            if (registerRes.ok) return true;
            else return false;
          }

          return false;
        } catch (err) {
          console.error("Error in signIn callback:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.email = user.email;
      }
      if (user) {
        token.email = user.email;
        token.role = (user as any).role;
        token.name = (user as any).name;
        token.address = (user as any).address;
        // Store token if provided by user object (from login response)
        if ((user as any).token) {
          token.token = (user as any).token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      // Include token in session if available
      if (token.token) {
        (session as any).token = token.token as string;
      }
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).name = token.name;
        (session.user as any).address = token.address;
        // Also include token in user object for easier access
        if (token.token) {
          (session.user as any).token = token.token as string;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After successful sign in, redirect based on role
      // This is primarily for Google OAuth redirects
      return url.startsWith(baseUrl) ? url : baseUrl + "/home";
    },
  },
  pages: {
    signIn: "/login",
  },
};
