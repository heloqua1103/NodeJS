import jwt, { TokenExpiredError } from "jsonwebtoken";
import { notAuth } from "./handle_errors";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token) return notAuth("Require login!!", res);
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const isChecked = err instanceof TokenExpiredError;
      if (!isChecked) return notAuth("Access Token invalid", res, isChecked);
      if (isChecked) return notAuth("Access Token expired", res, isChecked);
    }
    req.user = user;
    next();
  });
};

export default verifyToken;
