import express from "express";
import cors from "cors";
require("dotenv").config();
const initRoutes = require("./src/routes");
require("./connection_DB");

const app = express();
const port = process.env.PORT || 8001;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoutes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
