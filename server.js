const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "hunterv",
    password: "",
    database: "face-finder",
  },
});

const app = express();

const database = {
  users: [
    {
      id: "123",
      name: "Joe",
      password: "mom",
      email: "momm@mom.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Jib",
      password: "oob",
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

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  bcrypt.compare(
    "ommy",
    "$2a$10$igi7U3OOSeUWWdFvNuc3.O8Prq7bzAim9iPUf/2FEzC0pJhQK6o1O",
    function (err, res) {}
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$igi7U3OOSeUWWdFvNuc3.O8Prq7bzAim9iPUf/2FEzC0pJhQK6o1O",
    function (err, res) {}
  );

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("unable to register"));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not Found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
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
