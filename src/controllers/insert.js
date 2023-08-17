import * as authServices from "../services";

export const insertData = async (req, res) => {
  try {
    const response = await authServices.insertData();
    return res.status(200).json(response);
  } catch (error) {
    return error;
  }
};
