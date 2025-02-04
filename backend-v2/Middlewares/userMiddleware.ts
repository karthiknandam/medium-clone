import { Hono } from "hono";
import { verify, decode } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
const userMiddleware = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();

userMiddleware.use("/api/v1/blog/*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    c.status(403);
    return c.json({
      error: "Wrong Credentials",
    });
  }
  try {
    const isValid = await verify(token, c.env?.SECRET_KEY);
    if (!isValid) {
      c.status(403);
      return c.json({
        error: "Wrong Credentials",
      });
    }
    const { payload } = decode(token); // Extract user data
    if (!payload?.id) {
      c.status(403);
      return c.json({ error: "Wrong Credentials" });
    }
    const id = String(payload.id);
    const userData = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!userData) {
      c.status(403);
      return c.json({
        error: "Wrong Credentials",
      });
    }
    c.set("userId", id);
    await next();
  } catch (e: any) {
    c.status(411);
    return c.json({
      error: e.message,
    });
  }
});
export default userMiddleware;
