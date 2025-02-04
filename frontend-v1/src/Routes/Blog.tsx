import Post from "../Components/Post";
import NavBar from "../Components/NavBar";
import { useBlogs } from "../Hooks";

const Blog = () => {
  const { loading, blogs, error } = useBlogs({ url: "bulk" });

  return (
    <>
      <NavBar name={"M"} />
      {loading && (
        <div className="flex justify-center items-center font-bold text-lg h-full">
          Loading .......
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center font-bold text-lg">
          {error}
        </div>
      )}
      {!loading && !error && blogs && (
        <section className="flex justify-center">
          <div className="max-w-xl">
            {blogs.map((blog) => (
              <Post
                key={blog.id}
                id={blog.id}
                authorName={blog.author.name}
                PublishedDate="2nd Feb 2025"
                title={blog.title}
                content={blog.content}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Blog;
