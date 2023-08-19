import { notAuth } from "./handle_errors";

export const isAdmin = (req, res, next) => {
  const { roleCode } = req.user;
  if (roleCode !== "R1") return notAuth("Require role Admin", res);
  next();
};

export const isModeratorOrAdmin = (req, res, next) => {
  const { roleCode } = req.user;
  if (roleCode !== "R1" && roleCode !== "R2")
    return notAuth("Require role Admin or Moderator ", res);
  next();
};
