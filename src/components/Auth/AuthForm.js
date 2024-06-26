import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import classes from "./AuthForm.module.css";
import AuthContext from "../store/auth-context";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBe8xCvxkWbFjwndTl_vUFJXoPpjbAOS48";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBe8xCvxkWbFjwndTl_vUFJXoPpjbAOS48";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMsg = "Authentication failed!";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }

            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken);
        history.replace("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  const forgotPasswordHandler = () => {
    setIsResetPassword(true);
  };
  const resetPasswordHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    setIsLoading(true);
    fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBe8xCvxkWbFjwndTl_vUFJXoPpjbAOS48`,
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          requestType: "PASSWORD_RESET",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          alert(
            "Password reset email sent successfully. Please check your email inbox."
          );
          setIsResetPassword(false);
        } else {
          return res.json().then((data) => {
            let errorMsg = "Password reset failed!";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            throw new Error(errorMsg);
          });
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>

        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <br />
          <button onClick={forgotPasswordHandler}>Forgot Password</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
        {isResetPassword && (
          <div className={classes.modal}>
            <form onSubmit={resetPasswordHandler}>
              <div className={classes.control}>
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" required ref={emailInputRef} />
              </div>
              <div className={classes.actions}>
                {!isLoading && <button>Reset Password</button>}
                {isLoading && <p>Sending Request...</p>}
                <br />
                <button type="button" onClick={() => setIsResetPassword(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </form>
    </section>
  );
};

export default AuthForm;
