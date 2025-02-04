import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  userSignInSchema,
  userSignUpSchema,
  UserSignInType,
  UserSignUpType,
} from "karthikeya-medium-blog-common";
import { sign } from "hono/jwt";
const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string; // Make sure you are putting this thing in the wrangler.json vars : DBURL : "askdnflkasdlkfjlk"
    SECRET_KEY: string;
  };
}>();

userRouter.post("/signup", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const data = userSignUpSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(403);
    return c.json({
      error: data.error.errors[0].message,
    });
  }
  const { email, password, name }: UserSignUpType = data.data;
  try {
    const userData = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
      select: {
        id: true,
      },
    });
    const token = await sign({ id: userData.id }, c.env?.SECRET_KEY);
    return c.json({
      token,
    });
  } catch (e: any) {
    c.status(411);
    return c.json({
      error: e.message,
    });
  }
});

userRouter.post("/signin", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const data = userSignInSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(403);
    return c.json({
      error: data.error.errors[0].message,
    });
  }
  const { email, password }: UserSignInType = data.data;
  try {
    const userData = await prisma.user.findUnique({
      where: {
        email,
        password,
      },
      select: {
        id: true,
      },
    });
    const token = await sign({ id: userData?.id }, c.env?.SECRET_KEY);
    return c.json({
      token,
    });
  } catch (e: any) {
    c.status(411);
    return c.json({
      error: e.message,
    });
  }
});

export default userRouter;
