import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Users(props) {
  const navigate = useNavigate();

  if (props.token) {
    axios.defaults.headers.common = { Authorization: `Bearer ${props.token}` };
  } else {
    navigate("/");
  }

  const [users, setUsers] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const getUsers = () => {
    axios
      .get("/api/users/")
      .then((result) => {
        setUsers(result.data);
        setAllChecked(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/");
        } else {
          console.log(err.response.status);
          alert("Error occurred");
        }
      });
  };

  useEffect(getUsers, []);

  function handleUserCheck(clickedUser) {
    const updatedUser = { ...clickedUser, isSelected: !clickedUser.isSelected };
    const updatedUsers = users.map((user) =>
      user === clickedUser ? updatedUser : user
    );
    const updatedAllChecked = updatedUsers.every((user) => user.isSelected);
    setUsers(updatedUsers);
    setAllChecked(updatedAllChecked);
  }

  function handleHeaderCheck() {
    const updatedAllChecked = !allChecked;
    const updatedUsers = users.map((user) =>
      user.isSelected === updatedAllChecked
        ? user
        : { ...user, isSelected: updatedAllChecked }
    );
    setAllChecked(updatedAllChecked);
    setUsers(updatedUsers);
  }

  const handleBlockUsers = (is_active) => {
    const checkedUsers = users.filter((user) => user.isSelected);
    if (checkedUsers.length === 0) {
      return;
    }

    const ids = checkedUsers.map((user) => user.user_id);
    axios
      .put("/api/users/block", {
        ids,
        is_active,
      })
      .then((_) => {
        getUsers();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/");
        } else {
          console.log(err.response.status);
          alert("Error occurred");
        }
      });
  };

  const handleDeleteUsers = () => {
    const checkedUsers = users.filter((user) => user.isSelected);
    if (checkedUsers.length === 0) {
      return;
    }

    const ids = checkedUsers.map((user) => user.user_id);
    axios
      .put("/api/users/delete", {
        ids,
      })
      .then((_) => {
        getUsers();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/");
        } else {
          console.log(err.response.status);
          alert("Error occurred");
        }
      });
  };

  return (
    <Container>
      <Row>
        <Col className="m-2">
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup className="me-2" aria-label="First group">
              <Button onClick={() => handleBlockUsers(false)} variant="danger">
                Заблякаваць
              </Button>
              <Button
                onClick={() => handleBlockUsers(true)}
                variant="light"
                title="Unblock"
              >
                <span role="img" aria-label="dog">
                  🔓
                </span>
              </Button>
              <Button onClick={() => handleDeleteUsers()} title="Delete">
                <span role="img" aria-label="dog">
                  ❌
                </span>
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                inline
                checked={allChecked}
                onChange={handleHeaderCheck}
                aria-label="option 1"
              />
              Абраць усіх
            </th>
            <th>ID</th>
            <th>Імя</th>
            <th>Email</th>
            <th>Дата рэгістрацыі</th>
            <th>Дата апошняга ўваходу</th>
            <th>Стан</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>
                <Form.Check
                  onChange={() => handleUserCheck(user)}
                  checked={user.isSelected}
                  aria-label="option 1"
                />
              </td>
              <td>{user.user_id}</td>
              <td>{user.user_name}</td>
              <td>{user.email}</td>
              <td>{user.reg_date}</td>
              <td>{user.last_login_date}</td>
              <td>{user.is_active ? "Актыўны" : "Заблякаваны"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Users;
