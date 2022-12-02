import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup(props) {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
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
      .post("/api/users/", {
        user_name: name,
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
          <h3 className="Auth-form-title">Зарэгістравацца</h3>
          <div className="text-center">
            Ужо зарэгістраваліся? {""}
            <span className="link-primary" onClick={props.onChangeAuthMode}>
              Увайсьці
            </span>
          </div>
          <Form.Group className="mt-3">
            <Form.Label>Імя</Form.Label>
            <Form.Control
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="mt-1"
              placeholder="напрыклад Лявон Баршчэўскі"
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Email адрас</Form.Label>
            <Form.Control
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1"
              placeholder="Email адрас"
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1"
              placeholder="Пароль"
            />
          </Form.Group>
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
