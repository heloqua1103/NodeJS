import * as authServices from "../services";

export const register = async (req, res) => {
  try {
    const response = await authServices.register();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};
