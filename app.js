require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.APP_PORT ?? 5000;
const database = require("./database");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./UI/build")));

const getUsers = (req, res) => {
  database
    .query(
      "select user_id, user_name, email, reg_date, last_login_date, is_active from user"
    )

    .then(([user]) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUsers = (req, res) => {
  const { user_name, email, user_password } = req.body;
  const hash = crypto.createHash("SHA3-256");
  const passHash = hash.update(user_password).digest("hex");
  database
    .query(
      "INSERT INTO user (user_name, email, user_password, reg_date, last_login_date, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [user_name, email, passHash, new Date(), new Date(), true]
    )
    .then(async ([result]) => {
      const user_id = result.insertId;
      const payload = { sub: user_id };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      await saveToken(token, user_id);

      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error");
    });
};

const saveToken = (token, user_id) => {
  return database.query("update user set last_token = ? where (user_id= ?);", [
    token,
    user_id,
  ]);
};

const login = (req, res) => {
  const { email, user_password } = req.body;
  const hash = crypto.createHash("SHA3-256");
  const passHash = hash.update(user_password).digest("hex");
  database
    .query(
      "SELECT user_id from user where email=? and user_password=? and is_active=1;",
      [email, passHash]
    )
    .then(async ([users]) => {
      if (users.length > 0) {
        const user_id = users[0].user_id;
        const payload = { sub: user_id };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        await saveToken(token, user_id);

        res.send({ token });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error");
    });
};

const putUser = (req, res) => {
  const { is_active, ids } = req.body;
  const userIds = ids.join(",");
  const tokenQueryPart = is_active ? "" : ",last_token=null";
  database
    .query(
      `update user set is_active = ? ${tokenQueryPart} where FIND_IN_SET(user_id, ?) > 0;`,
      [is_active, userIds]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error");
    });
};

const deleteUsers = (req, res) => {
  const { ids } = req.body;
  const userIds = ids.join(",");
  database
    .query("delete from user where FIND_IN_SET(user_id, ?) > 0;", [userIds])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error");
    });
};

const verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);

    const [result] = await database.query(
      "SELECT last_token from user where last_token=?;",
      [token]
    );

    if (result.length > 0) {
      next();
    } else {
      throw new Error("Token was revoked");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

app.post("/api/users", postUsers);

app.post("/api/login", login);

app.put("/api/users/delete", verifyToken, deleteUsers);

app.put("/api/users/block", verifyToken, putUser);

app.get("/api/users", verifyToken, getUsers);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./UI/build/index.html"));
});

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
