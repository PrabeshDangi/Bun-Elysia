import jwt from "jsonwebtoken";
import {
  IaccessToken,
  IrefreshToken,
  IsignToken,
  Itokens,
} from "../Types/tokens.type";

export async function signTokens(tokensign: IsignToken): Promise<Itokens> {
  const accessTokenPayload: IaccessToken = {
    id: tokensign.id,
    username: tokensign.username,
  };

  const refreshTokenPayload: IrefreshToken = {
    id: tokensign.id,
    tokenVersion: tokensign.tokenVersion as unknown as number,
  };

  const refreshToken = jwt.sign(
    refreshTokenPayload,
    process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_EXPIRY,
    }
  );

  const accessToken = jwt.sign(accessTokenPayload, process.env.ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_EXPIRY,
  });

  return { refreshToken, accessToken };
}
