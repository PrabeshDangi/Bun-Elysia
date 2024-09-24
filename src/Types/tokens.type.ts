export interface IrefreshToken {
  id: string;
  tokenVersion: number;
}

export interface IaccessToken {
  id: string;
  username: string;
}

export interface Itokens {
  refreshToken: string;
  accessToken: string;
}

export interface IsignToken {
  id: string;
  username: string;
  tokenVersion?: number;
}
