import { ChangeEvent, useRef, useState } from "react";
import HeaderComponent from "../Components/HeaderComponent";
import InputComponent from "../Components/InputComponent";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { UserSignInType } from "karthikeya-medium-blog-common";
import { BACKEND_URL } from "../common";
const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isDisable, setDisable] = useState<boolean>(false);
  const navigate = useNavigate();
  const onchangeEmail = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };
  const onchangePassword = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };
  const buttonOnClick = async (): Promise<void> => {
    const userData: UserSignInType = {
      email,
      password,
    };
    try {
      setDisable(true);
      const user = await axios.post(
        `${BACKEND_URL}/api/v1/user/signin`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { token }: any = user.data;
      if (localStorage.getItem("Autherization")) {
        localStorage.removeItem("Autherization");
      }
      console.log(user);
      localStorage.setItem("Autherization", `Bearer ${token}`);
      navigate("/dashboard");
    } catch (e) {
      setDisable(false);
      console.log(e);
    }
  };
  return (
    <>
      <section className="grid grid-cols-2 h-screen">
        <div className="bg-blue-500"> </div>
        <div className="bg-white flex flex-col justify-center p-20">
          <HeaderComponent
            label="Account Signup"
            subheading="Beconme a memeber and enjoy exclusive promotions"
          />
          <InputComponent onchange={onchangeEmail} label="Email" />
          <InputComponent onchange={onchangePassword} label="Password" />
          <button
            className="w-full mt-5 bg-blue-button text-white py-3 text-md text-center cursor-pointer  hover:drop-shadow-2xl rounded-md mb-3"
            onClick={buttonOnClick}
            disabled={isDisable}
          >
            {isDisable ? "Loading..." : "Compleate"}
          </button>
          <p className="text-md text-gray-600 text-center">
            Don't You have an account please{" "}
            <Link
              className="underline text-blue-button cursor-pointer"
              to="/signup"
            >
              sign up
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default SignIn;
