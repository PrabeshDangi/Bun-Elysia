import { Context } from "elysia";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  username: string;
}

export interface AuthContext extends Context {
  user?: UserPayload;
}

export const verifyToken = async (
  { cookie, context }: { cookie: Record<string, any>; context: AuthContext },
  next: () => Promise<void>
) => {
  const accessToken = cookie.access_token?.value;
  if (!accessToken) {
    return {
      status: 401,
      body: { message: "Access token is required." },
    };
  }

  try {
    const decodedData = jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET
    ) as UserPayload;
    context.user = decodedData;
  } catch (error) {
    return {
      status: 401,
      body: { message: "Invalid access token." },
    };
  }

  await next();
};
