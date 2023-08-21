import { badRequest, notAuth } from "../middlewares/handle_errors";
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
      const accessToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
              roleCode: response[0].role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5s" }
          )
        : null;
      const refreshToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "10d" }
          )
        : null;

      resolve({
        err: response[1] ? 0 : 1,
        message: response[1] ? "Register is successfully" : "Email is exist",
        access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response[0].id },
          }
        );
      }
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
      const accessToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
              email: response.email,
              roleCode: response.role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "45s" }
          )
        : null;
      const refreshToken = isChecked
        ? jwt.sign(
            {
              id: response.id,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "10d" }
          )
        : null;
      resolve({
        err: accessToken ? 0 : 1,
        message: accessToken
          ? "Login successfully"
          : response
          ? "Password was wrong"
          : `Email is'n exist`,
        access_token: accessToken ? `Bearer ${accessToken}` : accessToken,
        refresh_token: refreshToken,
      });
      if (refreshToken) {
        await db.User.update(
          {
            refresh_token: refreshToken,
          },
          {
            where: { id: response.id },
          }
        );
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });

export const refreshToken = (refresh_token) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { refresh_token },
      });
      if (response) {
        jwt.verify(
          refresh_token,
          process.env.JWT_SECRET_REFRESH_TOKEN,
          (err) => {
            if (err)
              resolve({
                err: 1,
                mess: "Refresh token expired. Require login again!!",
              });
            else {
              const accessToken = jwt.sign(
                {
                  id: response.id,
                  email: response.email,
                  roleCode: response.role_code,
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
              );
              resolve({
                err: accessToken ? 0 : 1,
                mess: accessToken ? "Ok" : "Fail to generate new access token",
                access_token: accessToken
                  ? `Bearer ${accessToken}`
                  : accessToken,
                refresh_token: refresh_token,
              });
            }
          }
        );
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
