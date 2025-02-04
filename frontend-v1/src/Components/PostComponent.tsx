import { useRef, useState, useEffect } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../common.ts";
const PostComponent = () => {
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [id, setId] = useState<string>("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const titleValue = title.current?.value || "";
    const contentValue = content.current?.value || "";
    setLoading(true);
    if (!titleValue || !contentValue) {
      alert("Please fill in both fields!");
      return;
    }
    const json = {
      title: titleValue,
      content: contentValue,
    };
    try {
      const postDetails = await axios.post(
        `${BACKEND_URL}/api/v1/blog/`,
        json,
        {
          headers: {
            Authorization: localStorage.getItem("Autherization"),
            "Content-Type": "application/json",
          },
        }
      );
      setId(postDetails.data.id);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
      navigate(`/blog/${id}`);
    }
  };

  //~ Imp step runs only after the id is got
  useEffect(() => {
    if (id) {
      navigate(`/blog/${id}`);
    }
  }, [id, navigate]);

  return (
    <>
      <section>
        <NavBar name="K" />
        <div className="flex w-full justify-center mt-2">
          <div className="flex flex-col w-150 mt-2">
            <input
              ref={title}
              className="w-full border-2 border-gray-400 rounded-md mb-3 px-4 py-3 text-base"
              type="text"
              placeholder="Title"
            />
            <textarea
              ref={content}
              className="h-50 w-full border-2 border-gray-400 rounded-md px-4 pt-3 text-left resize-none text-base mb-2 font-"
              placeholder="Write an article"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-button text-white px-4 py-2 cursor-pointer rounded-sm"
            >
              {loading ? "Publishing...." : "Publish"}
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
      </section>
    </>
  );
};

export default PostComponent;
