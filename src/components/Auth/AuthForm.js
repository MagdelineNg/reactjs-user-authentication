import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import AuthContext from "../../store/auth-context";
import LoadingSpinner from "../UI/LoadingSpinner";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const emailInputRef = useRef();
  const pwInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const submitHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCqaZwPSdk7WwFgvOgH5wwXDUYkMQoZlZo";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCqaZwPSdk7WwFgvOgH5wwXDUYkMQoZlZo";
    }

    try {
      const enteredEmail = emailInputRef.current.value;
      const enteredPw = pwInputRef.current.value;

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPw,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setIsLoading(false);

      if (data && data.error && data.error.message) {
        //specific error (e.g. weak password)
        const errorMessage = data.error.message;

        if (errorMessage === "EMAIL_EXISTS") {
          alert("Email already exists. Please login instead.");
        } else if (errorMessage === "TOO_MANY_ATTEMPTS_TRY_LATER") {
          alert("Please try again later.");
        } else if (errorMessage === "WEAK_PASSWORD") {
          alert("Password should contain at least 6 characters.");
        } else if (errorMessage === "EMAIL_NOT_FOUND") {
          alert("No user with this email exists. Please sign up.");
        } else if (errorMessage === "INVALID_PASSWORD") {
          alert("Email or password is incorrect.");
        } else if (errorMessage) {
          alert("Authentication failed.");
        }

        throw new Error(errorMessage);
      }

      if (response.ok) {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        authCtx.login(data.idToken, expirationTime.toISOString());

        //replace prevents user from using back button
        history.replace("/");
      }
    } catch (error) {
      // api error (e.g. post 400)
      console.log(error.message);
    }
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={pwInputRef} required />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <LoadingSpinner />}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
