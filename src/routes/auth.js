import * as controllers from "../controllers";
const router = require("express").Router();

router.post("/register", controllers.register);

router.post("/login", controllers.login);

module.exports = router;
