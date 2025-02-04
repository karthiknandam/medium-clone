import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import userRouter from "../Routes/user";
import userMiddleware from "../Middlewares/userMiddleware";
import blogRouter from "../Routes/blog";

import { cors } from "hono/cors";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Use CORS middleware
app.use(
  "*",
  cors({
    origin: "*", // Allow all origins (for development)
    allowMethods: ["GET", "POST", "OPTIONS", "PUT"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);
app.route("/", userMiddleware);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog/", blogRouter);
export default app;
