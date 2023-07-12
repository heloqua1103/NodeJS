import db from "../models";

export const register = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("Register service");
      console.log("after resolve");
    } catch (e) {
      reject(e);
    }
  });
};
