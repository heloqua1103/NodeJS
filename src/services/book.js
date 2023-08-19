import db from "../models";
import { Op } from "sequelize";
import { v4 as generateId } from "uuid";
const cloudinary = require("cloudinary").v2;

export const getBooks = ({ page, limit, order, name, available, ...query }) =>
  new Promise(async (resolve, reject) => {
    try {
      const queries = { raw: true, nest: true };
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_BOOK;
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.title = { [Op.substring]: name };
      if (available) query.available = { [Op.between]: available };
      const response = await db.Book.findAndCountAll({
        where: query,
        ...queries,
        attributes: {
          exclude: ["category_code", "description"],
        },
        include: [
          {
            model: db.Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            as: "categoryData",
          },
        ],
      });

      resolve({
        err: response ? 0 : 1,
        message: response ? "Got" : "Can not found!!!",
        bookData: response,
      });
    } catch (e) {
      reject(e);
    }
  });

export const createNewBook = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.findOrCreate({
        where: { title: body?.title },
        defaults: {
          ...body,
          id: generateId(),
          image: fileData?.path,
        },
      });

      resolve({
        err: response[1] ? 0 : 1,
        message: response[1] ? "Created" : "Can not create new book!!!",
      });
      if (fileData && !response[1])
        cloudinary.uploader.destroy(fileData.filename);
    } catch (e) {
      reject(e);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });

export const updateBook = ({ bookId, ...body }, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if (fileData) {
        body.image = fileData?.path;
      }
      const response = await db.Book.update(body, {
        where: { id: bookId },
      });

      resolve({
        err: response[0] > 0 ? 0 : 1,
        message: response[0] > 0 ? "Updated" : "Can not update book!!!",
      });
      if (fileData && !response[0] === 0)
        cloudinary.uploader.destroy(fileData.filename);
    } catch (e) {
      reject(e);
      if (fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });

export const deleteBook = (bookIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.destroy({
        where: { id: bookIds },
      });
      resolve({
        err: response > 0 ? 0 : 1,
        message: response > 0 ? "Deleted" : "Can not delete book!!!",
      });
    } catch (e) {
      reject(e);
    }
  });
