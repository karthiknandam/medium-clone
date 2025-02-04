import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../common";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  authorId: string;
}
export const useBlogs = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${url}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Autherization"),
          },
        });
        setBlogs(response.data.blog);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { loading, blogs, error };
};
export const useBlog = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [blog, setBlog] = useState<Blog>({
    id: "",
    title: "",
    content: "",
    author: {
      name: "",
    },
    authorId: "",
  });
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/blog/${url}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Autherization"),
          },
        });
        setBlog(response.data.blog);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { loading, blog, error };
};
