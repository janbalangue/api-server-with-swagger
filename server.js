const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
];

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "API for managing users",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
  },
  apis: ['./swagger.yaml'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "User Management API Docs",
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API docs available at http://localhost:${PORT}/api-docs`);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.delete("/users/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send("User not found");
  }
});
