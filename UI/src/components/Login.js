import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    axios
      .post("/api/login", {
        email: email,
        user_password: password,
      })
      .then(function(response) {
        props.onAuth(response.data.token);
        navigate("/Users");
      })
      .catch(function(error) {
        console.log(error);
        alert("Error occurred");
      });
  };

  return (
    <div className="Auth-form-container">
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="Auth-form"
      >
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Увайсьці</h3>
          <div className="text-center">
            Шчэ не зарэгістраваліся? {""}
            <span className="link-primary" onClick={props.onChangeAuthMode}>
              Зарэгістравацца
            </span>
          </div>
          <Form.Group className="mt-3">
            <Form.Label>Email адрас</Form.Label>
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="mt-1"
              placeholder="Увядзіце email"
            />
          </Form.Group>
          <div className="form-group mt-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="mt-1"
              placeholder="Увядзіце пароль"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Падцьвердзіць
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
