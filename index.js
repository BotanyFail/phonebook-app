const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", function getBody(req) {
  const obj = { ...req.body };
  if (JSON.stringify(obj) === "{}") {
    return "-";
  } else {
    delete obj["id"];
    return JSON.stringify(obj);
  }
});

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// function requestLogger(req, res, next) {
//   console.log("Method:", req.method);
//   console.log("Path:", req.path);
//   console.log("Body:", req.body);
//   console.log("---");
//   next();
// }

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to Phonebook Backend</h1><br><p>Goto http://localhost:3001/api/persons for data</p>"
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res
    .send(
      `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `
    )
    .end();
});

app.get("/api/persons/:id", (req, res) => {
  const person = persons.find((p) => p.id === Number(req.params.id));
  if (!person) {
    res.status(400).json({ error: "content missing" });
  } else {
    res.status(200).json(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post("/api/persons/", (req, res) => {
  const person = req.body;
  if (!person.name) {
    res.status(400).json({ error: "name can't be empty" });
  } else if (!person.number) {
    res.status(400).json({ error: "number can't be empty" });
  } else if (persons.find((p) => p.name === person.name)) {
    res.status(400).json({ error: "name must be unique" });
  } else {
    person.id = generateId();
    persons = persons.concat(person);
    res.json(person);
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
