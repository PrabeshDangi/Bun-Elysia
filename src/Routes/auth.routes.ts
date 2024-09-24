import { Elysia } from "elysia";
import { authController } from "../Controllers/auth.controller";

const authRoutes = (app: Elysia) => {
  authController(app);
};

export default authRoutes;
