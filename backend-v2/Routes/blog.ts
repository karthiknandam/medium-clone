import { Hono } from "hono";
import userMiddleware from "../Middlewares/userMiddleware";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import {
  CreateBlogPostType,
  UpdateBlogPostType,
  updateBlogPostSchema,
  createBlogPostSchema,
} from "karthikeya-medium-blog-common";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    SECRET_KEY: string;
  };
  Variables: {
    userId: string;
  };
}>();
type newCreatePost = Omit<CreateBlogPostType, "authorId">;
blogRouter.route("*", userMiddleware);
blogRouter.post("/", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const userId = c.get("userId");
  console.log(userId);
  if (!userId) {
    c.status(403);
    return c.json({
      error: "Wrong UserCredentials",
    });
  }
  const modifiedSchema = createBlogPostSchema.omit({ authorId: true });
  const data = modifiedSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(403);
    return c.json({
      error: data.error.errors[0].message,
    });
  }
  try {
    const { title, content }: newCreatePost = data.data;
    const userData = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });
    return c.json({
      id: userData.id,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      error: "Failed to Create Post",
    });
  }
});

blogRouter.put("/", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const data = updateBlogPostSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(403);
    return c.json({
      error: data.error.errors[0].message,
    });
  }
  try {
    const { title, content, id }: UpdateBlogPostType = data.data;
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });
    return c.json({
      message: "Updated Succesfully",
    });
  } catch (e) {
    c.status(411);
    return c.json({
      errror: "Internal server Error",
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  });
  try {
    const blog = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        authorId: true,
      },
    });
    return c.json({
      blog,
    });
  } catch (e: any) {
    c.status(411);
    return c.json({
      error: e.message,
    });
  }
});

blogRouter.get("/:id", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const id = c.req.param("id");
  try {
    const blog = await prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
        authorId: true,
      },
    });
    if (!blog) {
      return c.json({
        error: "Unable to Find the post",
      });
    }
    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411);
    return c.json({
      error: "Internal Server Error",
    });
  }
});
export default blogRouter;
