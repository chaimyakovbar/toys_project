const usersR = require("./users");
const toysR = require("./toys");

exports.router = (app) => {
  app.use("/", toysR);
  app.use("/users", usersR);
};
