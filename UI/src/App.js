import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Users from "./components/Users";

function App() {
  const [token, setToken] = useState(undefined);

  const handleAuth = (newToken) => {
    setToken(newToken);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth onAuth={handleAuth} />} />
        <Route path="/users" element={<Users token={token} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
