import { Link } from "react-router-dom";

interface Postinterface {
  id: string;
  authorName: string;
  PublishedDate: string;
  title: string;
  content: string;
}
const Post = ({
  id,
  authorName,
  PublishedDate,
  title,
  content,
}: Postinterface) => {
  return (
    <Link to={`/blog/${id}`}>
      <section className="border-b-2 border-gray-300 p-4 cursor-pointer">
        <div className="flex mb-2">
          <Profile name={authorName[0]} />
          <div className="flex justify-center items-center text-md ml-2 font-light text-gray-800">
            {authorName}
          </div>
          <div className="flex justify-center items-center ml-2">
            <Dot />
          </div>
          <div className="flex justify-center items-center font-extralight text-gray-500 ml-2">
            {PublishedDate}
          </div>
        </div>
        <div className="mb-3">
          <div className="font-extrabold text-gray-800 text-2xl mb-1.5">
            {title}
          </div>
          <div className="font-light text-lg text-gray-500 ">
            {content.slice(0, 121) + "...."}
          </div>
        </div>
        <div className="font-extralight text-base text-gray-500">
          {Math.floor(content.length / 100) + " Minutes read"}
        </div>
      </section>
    </Link>
  );
};
const Dot = () => {
  return (
    <div>
      <div className="bg-gray-800 w-1 h-1 rounded-full "></div>
    </div>
  );
};
export const Profile = ({
  name,
  size = "small",
}: {
  name: string;
  size?: string;
}) => {
  return (
    <div>
      <div
        className={`bg-gray-800 text-white ${
          size == "small" ? "w-7 h-7" : "w-10 h-10"
        } rounded-full flex justify-center items-center`}
      >
        <div className="text-xs">{name}</div>
      </div>
    </div>
  );
};
export default Post;
