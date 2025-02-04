import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./Routes/SignIn";
import SignUp from "./Routes/SignUp";
import Blog from "./Routes/Blog";
import FullBlog from "./Components/FullBlog";
import PostComponent from "./Components/PostComponent";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={"/signup"} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<FullBlog />} />
          <Route path="/post" element={<PostComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
