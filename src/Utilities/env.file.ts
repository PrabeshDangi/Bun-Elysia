declare module "bun" {
  interface Env {
    DATABASE_URL: string;
    ACCESS_SECRET: string;
    REFRESH_SECRET: string;
  }
}
