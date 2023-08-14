import React, { FC, useState, useEffect } from "react";
import facebookSvg from "images/Facebook.svg";
import twitterSvg from "images/Twitter.svg";
import googleSvg from "images/Google.svg";
import { Helmet } from "react-helmet";
import Input from "shared/Input/Input";
import { Link } from "react-router-dom";
import {
  googleLogout,
  useGoogleLogin,
  TokenResponse,
} from "@react-oauth/google";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { access } from "fs";

export interface PageLoginProps {
  className?: string;
}

const loginSocials = [
  // {
  //   name: "Continue with Facebook",
  //   href: "#",
  //   icon: facebookSvg,
  // },
  // {
  //   name: "Continue with Twitter",
  //   href: "#",
  //   icon: twitterSvg,
  // },
  {
    name: "Continue with Google",
    href: "#",
    icon: googleSvg,
  },
];

type TokenResponseWithoutError = Omit<
  TokenResponse,
  "error" | "error_description" | "error_uri"
>;

const PageLogin: FC<PageLoginProps> = ({ className = "" }) => {
  const [user, setUser] = useState<
    Omit<TokenResponse, "error" | "error_description" | "error_uri">[]
  >([]);
  const [profile, setProfile] = useState<TokenResponseWithoutError[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(false);

  const history = useHistory();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser((prevState) => [...prevState, codeResponse]);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  const normalLogin = (e) => {
    const inputElement = document.getElementById("email") as HTMLInputElement;
    e.preventDefault();

    if (signUp) {
      axios
        .post("/api/register", { email, password })
        .then((res) => {
          history.push("/");
          history.go(0);
        })
        .catch((err) => {
          inputElement.setCustomValidity(
            "Account already created with this email"
          );
          inputElement.reportValidity();
        });
    } else {
      axios
        .post("/api/login", { email, password })
        .then((res) => {
          history.push("/");
          history.go(0);
        })
        .catch((err) => {
          inputElement.setCustomValidity("Invalid Email or Password");
          inputElement.reportValidity();
        });
    }

    // inputElement.setCustomValidity("");
  };

  const responseMessage = (response: any) => {
    console.log(response);
  };

  useEffect(() => {
    if (user.length > 0) {
      let access_token = user[0].access_token;
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          axios
            .post("/api/oAuth", {
              email: res.data.email,
              firstName: res.data.given_name,
              lastName: res.data.family_name,
            })
            .then((res) => {
              history.push("/");
              history.go(0);
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  return (
    <div className={`nc-PageLogin ${className}`} data-nc-id="PageLogin">
      <Helmet>
        <title>{signUp ? "Signup" : "Login"} || Booking React ZVC </title>
      </Helmet>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          {signUp ? "Signup" : "Login"}
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          <div className="grid gap-3">
            {loginSocials.map((item, index) => (
              <div
                onClick={() => login()}
                key={index}
                className="nc-will-change-transform flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px] googleAuth"
              >
                <img
                  className="flex-shrink-0"
                  src={item.icon}
                  alt={item.name}
                />
                <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                  {item.name}
                </h3>
              </div>
            ))}
            {/* <GoogleLogin onSuccess={responseMessage} /> */}
          </div>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              OR
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form
            className="grid grid-cols-1 gap-6"
            onSubmit={normalLogin}
            action="#"
            method="post"
          >
            {signUp && (
              <>
                <label className="block">
                  <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                    First Name
                  </span>
                  <Input
                    id="password"
                    value={firstName}
                    required
                    type="text"
                    className="mt-1"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      const inputElement = document.getElementById(
                        "email"
                      ) as HTMLInputElement;
                      inputElement.setCustomValidity("");
                    }}
                  />
                </label>
                <label className="block">
                  <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                    Last Name
                  </span>
                  <Input
                    id="password"
                    value={lastName}
                    required
                    type="text"
                    className="mt-1"
                    onChange={(e) => {
                      setLastName(e.target.value);
                      const inputElement = document.getElementById(
                        "email"
                      ) as HTMLInputElement;
                      inputElement.setCustomValidity("");
                    }}
                  />
                </label>
              </>
            )}
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email address
              </span>
              <Input
                id="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  e.target.setCustomValidity("");
                }}
                type="email"
                placeholder="example@example.com"
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link to="/forgot-pass" className="text-sm">
                  Forgot password?
                </Link>
              </span>
              <Input
                id="password"
                value={password}
                required
                type="password"
                className="mt-1"
                onChange={(e) => {
                  setPassword(e.target.value);
                  const inputElement = document.getElementById(
                    "email"
                  ) as HTMLInputElement;
                  inputElement.setCustomValidity("");
                }}
              />
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>

          {/* ==== */}
          {!signUp ? (
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              New user? {` `}
              <span
                className="link"
                onClick={() => {
                  setSignUp(true);
                  const inputElement = document.getElementById(
                    "email"
                  ) as HTMLInputElement;
                  inputElement.setCustomValidity("");
                }}
              >
                Create an account
              </span>
            </span>
          ) : (
            <span className="block text-center text-neutral-700 dark:text-neutral-300">
              Already have an account? {` `}
              <span
                className="link"
                onClick={() => {
                  setSignUp(false);
                  const inputElement = document.getElementById(
                    "email"
                  ) as HTMLInputElement;
                  inputElement.setCustomValidity("");
                }}
              >
                Sign in
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
