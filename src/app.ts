import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import authRoutes from "./Routes/auth.routes";
import cookie from "@elysiajs/cookie";

const app = new Elysia();

app.use(swagger());
app.use(cookie());

//Routes
authRoutes(app);

export default app;
