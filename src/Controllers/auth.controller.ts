import Elysia from "elysia";
import prisma from "../../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signTokens } from "../Utilities/token.generator";
import { loginSchema, userSchema } from "../Validations";
import { AuthContext, verifyToken } from "../Middlewares/auth.middleware";

export const authController = (app: Elysia) => {
  app.post("/register", async ({ body }) => {
    const result = userSchema.safeParse(body);

    if (!result.success) {
      return {
        status: 400,
        body: {
          errors: result.error.issues,
        },
      };
    }

    const emailExists = await prisma.user.findFirst({
      where: {
        email: result.data.email,
      },
    });

    if (emailExists) {
      throw new Error("User with this email already exists!!");
    }

    const passwordHash = await bcrypt.hash(result.data.password, 10);

    await prisma.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: passwordHash,
      },
    });

    return {
      status: 201,
      body: { message: "User created successfully!!" },
    };
  });

  app.post(
    "login",
    async ({ body, set, cookie: { refresh_token, access_token } }) => {
      const result = loginSchema.safeParse(body);

      if (!result.success) {
        return {
          status: 400,
          body: {
            errors: result.error.issues,
          },
        };
      }

      const userExists = await prisma.user.findUnique({
        where: {
          email: result.data.email,
        },
      });

      if (!userExists) {
        throw new Error("User not registered!!");
      }

      const isPasswordCorrect = await bcrypt.compare(
        result.data.password,
        userExists.password
      );

      if (!isPasswordCorrect) {
        throw new Error("Invalid credentials!!");
      }

      const { refreshToken, accessToken } = await signTokens({
        id: userExists.id,
        username: userExists.username,
        tokenVersion: userExists.tokenVersion,
      });

      refresh_token.set({
        value: refreshToken,
        httpOnly: true,
        maxAge: 15 * 60,
        path: "/refresh-token",
      });

      access_token.set({
        value: accessToken,
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60,
      });

      return {
        status: 200,
        message: "User logged in sucessfully",
        accessToken,
      };
    }
  );

  app.get("protected", verifyToken, ({ context }: { context: AuthContext }) => {
    const user = context.user;
    console.log(user);
  });

  // app.post(
  //   "/logout",
  //   verifyToken,
  //   async ({ cookie:{ refresh_token, access_token }, context }: { cookie: any; context: AuthContext }) => {
  //     const user = context.user;

  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         tokenVersion: {
  //           increment: 1,
  //         },
  //       },
  //     });

  //     refresh_token.remove();
  //     access_token.remove()

  //     return {
  //       status: 200,
  //       body: { message: "Logout successful!" },
  //     };
  //   }
  // );

  // app.post(
  //   "/logout",
  //   verifyToken,
  //   async ({ cookie: { refresh_token, access_token } }) => {
  //     const user = context.user;

  //     if (!user) {
  //       return {
  //         status: 401,
  //         body: { message: "Unauthorized." },
  //       };
  //     }

  //     // Update token version in the database
  //     await prisma.user.update({
  //       where: { id: user.id },
  //       data: {
  //         tokenVersion: {
  //           increment: 1,
  //         },
  //       },
  //     });

  //     // Remove cookies
  //     // cookie.refresh_token?.remove();

  //     cookie.access_token?.remove();

  //     return {
  //       status: 200,
  //       body: { message: "Logout successful!" },
  //     };
  //   }
  // );
};
