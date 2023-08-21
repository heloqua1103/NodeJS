import * as controllers from "../controllers";
import express from "express";
import verifyToken from "../middlewares/verify_token";
import { isModeratorOrAdmin } from "../middlewares/verify_roles";
import uploadCloud from "../middlewares/uploader";

const router = express.Router();

router.get("/", controllers.getBooks);

router.use(verifyToken);
router.use(isModeratorOrAdmin);
router.post("/", uploadCloud.single("image"), controllers.createNewBook);
router.put("/", uploadCloud.single("image"), controllers.updateBook);
router.delete("/", controllers.deleteBook);

module.exports = router;
