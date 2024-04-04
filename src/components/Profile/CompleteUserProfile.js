import React, { useContext, useState } from "react";
import AuthContext from "../store/auth-context";

function CompleteUserProfile() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const authCtx = useContext(AuthContext);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBe8xCvxkWbFjwndTl_vUFJXoPpjbAOS48",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Name:", name);
    console.log("URL:", url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={handleNameChange} />
      </div>
      <div>
        <label htmlFor="url">Profile Photo URL:</label>
        <input type="url" id="url" value={url} onChange={handleUrlChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CompleteUserProfile;
