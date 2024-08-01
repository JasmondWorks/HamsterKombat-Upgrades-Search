const express = require("express");
const path = require("path");
const jsonServer = require("json-server");

const app = express();
const PORT = process.env.PORT || 3200;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

// Set up json-server middleware
const apiRouter = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

app.use("/api", middlewares, apiRouter);

// Serve the React app for any other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
