const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");

const app = express();

app.use(bodyParser.json());
const database = {
  users: [
    {
      id: "123",
      name: "Joe",
      email: "momm@mom.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Jib",
      email: "dad@mom.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "momm@mom.com",
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    "ommy",
    "$2a$10$igi7U3OOSeUWWdFvNuc3.O8Prq7bzAim9iPUf/2FEzC0pJhQK6o1O",
    function (err, res) {
      console.log("firstguess", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$igi7U3OOSeUWWdFvNuc3.O8Prq7bzAim9iPUf/2FEzC0pJhQK6o1O",
    function (err, res) {
      console.log("secondguess", res);
    }
  );

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});

app.listen(3000, () => {
  console.log("running");
});
