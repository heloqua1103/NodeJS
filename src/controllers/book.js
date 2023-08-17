import * as authServices from "../services";
import { internalServerError } from "../middlewares/handle_errors";
import joi from "joi";

export const getBooks = async (req, res) => {
  try {
    const response = await authServices.getBooks(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
