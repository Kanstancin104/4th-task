import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth(props) {
  let [authMode, setAuthMode] = useState("signin");

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  if (authMode === "signin") {
    return <Login onChangeAuthMode={changeAuthMode} onAuth={props.onAuth} />;
  }

  return <Signup onChangeAuthMode={changeAuthMode} onAuth={props.onAuth} />;
}
