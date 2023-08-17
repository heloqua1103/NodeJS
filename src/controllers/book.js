import * as authServices from "../services";
import { badRequest, internalServerError } from "../middlewares/handle_errors";
import {
  title,
  image,
  category_code,
  price,
  available,
} from "../helpers/joi_schema";
import joi from "joi";

export const getBooks = async (req, res) => {
  try {
    const response = await authServices.getBooks(req.query);
    return res.status(200).json(response);
  } catch (error) {
    // console.log(error);
    return internalServerError(res);
  }
};

export const createNewBook = async (req, res) => {
  try {
    const { error } = joi
      .object({
        title,
        image,
        category_code,
        price,
        available,
      })
      .validate(req.body);
    if (error) return badRequest(error.details[0].message, res);
    const response = await authServices.createNewBook(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};
