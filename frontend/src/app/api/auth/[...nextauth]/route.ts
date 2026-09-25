import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "typeform-clone-secret-key-12345",
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign in
      if (account) {
        try {
          // Send the Google id_token to our FastAPI backend
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
          const res = await fetch(`${apiUrl}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: account.id_token }),
          });
          
          if (res.ok) {
            const data = await res.json();
            token.accessToken = data.access_token;
          } else {
            console.error("Failed to authenticate with backend:", await res.text());
          }
        } catch (error) {
          console.error("Error connecting to backend auth:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send the access token to the client so it can make authenticated requests
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
