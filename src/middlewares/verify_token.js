import jwt from "jsonwebtoken";
import { notAuth } from "./handle_errors";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) return notAuth("Require login!!", res);
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return notAuth("Access Token may be expired or invalid", res);
    req.user = user;
    next();
  });
};

export default verifyToken;
