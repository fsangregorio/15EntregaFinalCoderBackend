
import bcrypt from "bcrypt";

export const createHash = async (password) => {
  return await bcrypt.hash(password, 15);
};

export const isValidPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};
