import * as authServices from "../services";
import { badRequest, internalServerError } from "../middlewares/handle_errors";
import {
  title,
  image,
  category_code,
  price,
  available,
  bookId,
  bookIds,
  filename,
  description,
} from "../helpers/joi_schema";
import joi from "joi";
const cloudinary = require("cloudinary").v2;

export const getBooks = async (req, res) => {
  try {
    const response = await authServices.getBooks(req.query);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};

export const createNewBook = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi
      .object({
        title,
        image,
        category_code,
        price,
        available,
        description,
      })
      .validate({
        ...req.body,
        image: fileData?.path,
      });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res);
    }
    const response = await authServices.createNewBook(req.body, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const updateBook = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi
      .object({
        bookId,
      })
      .validate({ bookId: req.body.bookId });
    if (error) {
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
      return badRequest(error.details[0].message, res);
    }
    const response = await authServices.updateBook(req.body, fileData);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const fileData = req.file;
    const { error } = joi
      .object({
        bookIds,
        filename,
      })
      .validate(req.query);
    if (error) {
      return badRequest(error.details[0].message, res);
    }
    const response = await authServices.deleteBook(
      req.query.bookIds,
      req.query.filename
    );
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
