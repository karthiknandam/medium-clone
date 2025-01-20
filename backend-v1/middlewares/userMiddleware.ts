import { Hono } from "hono";
import { Jwt } from "hono/utils/jwt";

const userMiddleware = new Hono<{
  Bindings: {
    SECRET_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();

userMiddleware.use("/api/v1/blog/*", async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) {
    c.status(400);
    return c.json({
      error: "unauthorized",
    });
  }

  try {
    const payload = await Jwt.verify(token, c.env.SECRET_KEY);

    if (!payload) {
      c.status(400);
      return c.json({
        error: "unauthorized",
      });
    }

    c.set("userId", payload.id as string);

    await next();
  } catch (err) {
    c.status(400);
    return c.json({
      error: "unauthorized",
    });
  }
});

export { userMiddleware };
