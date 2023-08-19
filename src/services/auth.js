import db from "../models";
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";

const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const register = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email },
        defaults: {
          email,
          password: hashPassword(password),
        },
      });
      const token = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
              roleCode: response[0].role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
          )
        : null;
      resolve({
        err: response[1] ? 0 : 1,
        message: response[1] ? "Register is successfully" : "Email is exist",
        access_token: token ? `Bearer ${token}` : token,
      });
    } catch (e) {
      reject(e);
    }
  });

export const login = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { email },
        raw: true,
      });
      const isChecked =
        response && bcrypt.compareSync(password, response.password);
      const token = isChecked
        ? jwt.sign(
            {
              id: response.id,
              email: response.email,
              roleCode: response.role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
          )
        : null;
      resolve({
        err: token ? 0 : 1,
        message: token
          ? "Login successfully"
          : response
          ? "Password was wrong"
          : `Email is'n exist`,
        access_token: token ? `Bearer ${token}` : token,
      });
    } catch (e) {
      reject(e);
    }
  });
