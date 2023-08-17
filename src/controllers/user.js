import * as authServices from "../services";
import { internalServerError, badRequest } from "../middlewares/handle_errors";

export const getCurrent = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await authServices.getOne(id);
    return res.status(200).json(response);
  } catch (error) {
    return internalServerError(res);
  }
};
