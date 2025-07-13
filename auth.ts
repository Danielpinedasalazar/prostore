import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextAuthConfig } from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 dias
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //encontrar usuario en la db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        //mirar si existe y la contraseña es igual
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          //si la contraseña es correcta devolver el usuario
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        //Si el usuario no existe o la contraseña no existe return null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      //Setiar el userID desde el token
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;

      console.log(token);

      //si hay una actualizacion, setiar el nombre del usuario
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      //Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        //if user has no name then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          //update db to reflect token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
        if (trigger === "signIn" || trigger == "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });

            if (sessionCart) {
              //delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              //asign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      if (session?.name && trigger === "update") {
        token.name = session.user.name;
      }
      return token;
    },
    authorized({ request, auth }: any) {
      //Array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      //get pathname form the request url
      const { pathname } = request.nextUrl;

      //Check if user is not authenticated and accessing a protected route
      if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

      //Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //Generate new session cartId cookie
        const sessionCartId = crypto.randomUUID();

        //Clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        //Create newResponse
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        //Set newely generated sessioncartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
