import NavBar from "./NavBar";
import { useBlog } from "../Hooks";
import { useParams } from "react-router-dom";
import { Profile } from "./Post";
const FullBlog = () => {
  const { id } = useParams();
  const { loading, blog, error } = useBlog({ url: `${id}` });

  return (
    <section className="h-screen">
      <NavBar name={"K"} />
      <div>
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
        {!loading && !error && blog && (
          <section className="grid grid-cols-3 px-20 mt-10">
            <div className="col-span-2">
              <h2 className="font-extrabold text-4xl mb-2">{blog.title}</h2>
              <div className="font-light text-gray-400 text-xs mb-3">
                Posted On {new Date().toLocaleString()}
              </div>
              <div className="text-sm text-gray-700">{blog.content}</div>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-3">Author</h3>
              <div className="flex">
                <div className="flex flex-col justify-center">
                  <Profile size="large" name={blog.author.name[0]} />
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-lg">{blog.author.name}</h4>
                  <p className="text-sm mt-1 font-light text-gray-500">
                    Random Gibrrish about the user when we get back to the user
                    we can be more porductive the day we start
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
};

export default FullBlog;
