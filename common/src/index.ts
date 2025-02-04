import z, { string } from "zod";

const userSignUpSchema = z.object({
  email: z.string().email({ message: "Enter correct Email format" }),
  password: z.string().min(6, { message: "Password Must Be a length of 6" }),
  name: z.string().optional(),
});
const userSignInSchema = z.object({
  email: z.string().email({ message: "Enter correct Email format" }),
  password: z.string().min(6, { message: "Password Must Be a length of 6" }),
});
const createBlogPostSchema = z.object({
  title: z.string().min(3, { message: "Title Not be empty" }),
  content: z.string().min(3, { message: "Content Not be Empty" }),
  published: z.boolean().default(false),
  authorId: z.string(),
});
const updateBlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(3, { message: "Title Not be empty" }),
  content: z.string().min(3, { message: "Content Not be Empty" }),
});
type CreateBlogPostType = z.infer<typeof createBlogPostSchema>;
type UpdateBlogPostType = z.infer<typeof updateBlogPostSchema>;
type UserSignUpType = z.infer<typeof userSignUpSchema>;
type UserSignInType = z.infer<typeof userSignInSchema>;
export {
  // Types

  CreateBlogPostType,
  UpdateBlogPostType,
  UserSignUpType,
  UserSignInType,

  //Schemas
  userSignInSchema,
  userSignUpSchema,
  createBlogPostSchema,
  updateBlogPostSchema,
};
