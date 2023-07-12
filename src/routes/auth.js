import * as controllers from "../controllers";
const router = require("express").Router();

router.post("/register", controllers.register);

module.exports = router;
