import z from "zod";
const userSignupSchema = z.object({
  email: z.string().email({ message: "Email format is wrong" }),
  name: z.string().optional(),
  password: z
    .string()
    .min(6, { message: "Password must be more thatn 6 letters" }),
});

const userSigninSchema = z.object({
  email: z.string().email({ message: "Email format is wrong" }),
  password: z
    .string()
    .min(6, { message: "Password must be more than 6 letters" }),
});

const blogPostSchema = z.object({
  title: z.string().min(1, { message: "Tittle Required" }),
  description: z.string().min(1, { message: "Description Required" }),
  published: z
    .boolean({ message: "Can't publish the blog" })
    .default(false)
    .optional(),
  authorId: z.string({ message: "Can't post blog" }),
});

const updateBlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Tittle Required" }),
  description: z.string().min(1, { message: "Description Required" }),
});
export {
  userSignupSchema,
  userSigninSchema,
  blogPostSchema,
  updateBlogPostSchema,
};
