const express = require("express");
const http = require("http");
const path = require("path");
const { router } = require("./routes/confidRoutes");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
router(app);

const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port);
