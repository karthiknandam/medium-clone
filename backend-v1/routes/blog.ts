import { Hono } from "hono";
import z from "zod";
import userMiddleware from "./user";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { blogPostSchema, updateBlogPostSchema } from "../Schema/zoddy";
const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: {
    userId: string;
  };
}>();

type blogPostSchemaType = z.infer<typeof blogPostSchema>;
type updateBlogPostSchemaType = z.infer<typeof updateBlogPostSchema>;

blogRouter.route("*", userMiddleware);

// ^ Create post

blogRouter.post("/", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  if (!userId) {
    return c.json({
      error: "cannot find user",
    });
  }

  const data = blogPostSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(400);
    return c.json({
      error: data.error.errors[0].message,
    });
  }

  const { title, description, authorId }: blogPostSchemaType = data.data;
  try {
    const post = await prisma.post.create({
      data: {
        title,
        description,
        authorId,
      },
    });

    return c.json({
      id: post.id,
      msg: "Post created succesfully",
    });
  } catch (err) {
    c.status(403);
    return c.json({
      error: "Unable to post the blog",
    });
  }
});

// ^ Update post
blogRouter.put("/", async (c): Promise<Response> => {
  const userId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const data = updateBlogPostSchema.safeParse(await c.req.json());
  if (!data.success) {
    c.status(400);
    return c.json({
      error: data.error.errors[0].message,
    });
  }

  const { title, id, description }: updateBlogPostSchemaType = data.data;

  try {
    const updateBlog = await prisma.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        title,
        description,
      },
    });
    return c.json({
      msg: "Updated Succesfull",
    });
  } catch (err) {
    c.status(403);
    return c.json({
      error: "Sorry! you can't update the blog / Server error",
    });
  }
});

blogRouter.get("/:id", async (c): Promise<Response> => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");
  if (!id) {
    c.status(400);
    return c.json({
      error: "Sorry Coud'nt find Post",
    });
  }
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      c.status(403);
      return c.json({
        error: "There is no such post exist",
      });
    }
    return c.json({
      post,
    });
  } catch (err) {
    return c.json({
      error: "Server Error / Post not found",
    });
  }
});

export default blogRouter;
