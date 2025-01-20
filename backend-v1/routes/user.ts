import { Hono } from "hono";
import z from "zod";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { userSignupSchema, userSigninSchema } from "../Schema/zoddy";
import { sign } from "hono/jwt";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();

type userSignupSchemaType = z.infer<typeof userSignupSchema>;
type userSigninSchemaType = z.infer<typeof userSigninSchema>;

// ^ signup route

userRouter.post("/signup", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const data = userSignupSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(400);
    return c.json({
      error: data.error.errors[0].message,
    });
  }
  const { email, password, name }: userSignupSchemaType = data.data;
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
  } catch (err) {
    return c.json({
      error: "Fail to signup",
    });
  }
});

// ^ signin route

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const data = userSigninSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(400);
    return c.json({
      error: data.error.errors[0].message,
    });
  }
  const { email, password }: userSigninSchemaType = data.data;
  try {
    const userData = await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
      select: {
        id: true,
      },
    });
    if (!userData) {
      return c.json({
        error: "Invalid user please sign up / enter correct details",
      });
    }
    const token = await sign({ id: userData?.id }, c.env?.SECRET_KEY);
    return c.json({
      token,
    });
  } catch (err) {
    c.status(403);
    return c.json({
      error: "Server Error",
    });
  }
});

export default userRouter;
