import * as authServices from "../services";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        errCode: 1,
        message: "Missing payload",
      });
    const response = await authServices.register(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        errCode: 1,
        message: "Missing payload",
      });
    const response = await authServices.login(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      errCode: -1,
      errMessage: "Internal server error",
    });
  }
};
