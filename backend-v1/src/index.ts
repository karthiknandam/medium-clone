import { Hono } from "hono";

import { userMiddleware } from "../middlewares/userMiddleware";
import userRouter from "../routes/user";
import blogRouter from "../routes/blog";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();

app.route("/", userMiddleware);

app.route("/api/v1/user", userRouter);

app.route("/api/v1/blog", blogRouter);

export default app;
