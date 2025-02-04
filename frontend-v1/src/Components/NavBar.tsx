import React from "react";
import { Profile } from "./Post";
import { Link } from "react-router-dom";

const NavBar = ({ name }: { name: string }) => {
  return (
    <nav className="flex justify-between px-10 py-2 border-b-2 border-b-gray-300 mb-2">
      <Link className="flex justify-center items-center" to={"/blog"}>
        <div className="cursor-pointer font-bold text-lg">Medium</div>
      </Link>
      <div className="flex">
        <Link to={"/post"}>
          <button className="bg-green-600 px-4 py-2 text-white rounded-full mr-2 cursor-pointer">
            Post
          </button>
        </Link>
        <Profile size="large" name={name[0]} />
      </div>
    </nav>
  );
};

export default NavBar;
