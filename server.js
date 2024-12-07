#!/usr/bin/node

const express = require("express");
const apiRoutes = require("./routes/index");

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Use the imported routes
app.use(apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is operational on port: ${port}`);
});