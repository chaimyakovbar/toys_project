const usersR = require("./users");
const toysR = require("./toys");

exports.router = (app) => {
  app.use("/toys", toysR);
  app.use("/users", usersR);
};
