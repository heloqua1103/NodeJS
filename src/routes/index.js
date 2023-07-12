import user from "./user";
import auth from "./auth";

const initRoutes = (app) => {
  app.use("/api/v1/user", user);
  app.use("/api/v1/auth", auth);

  return app.use("/", (req, res) => {
    return res.send("Hello World");
  });
};

module.exports = initRoutes;
