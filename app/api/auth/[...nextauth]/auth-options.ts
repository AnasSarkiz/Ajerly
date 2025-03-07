import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "lib/db/prisma";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
        return null;
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
        return null;
        }
        return user;
      
      },

    }),
        
  ],
  pages: {
    signIn: "/auth",
    newUser: "/auth/signup",
    
  },
  } 