
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = async (user) => {
  return await jwt.sign(
    {
      user: {
        ...user,
        password: undefined,
      },
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );
};

export const decodeToken = async (token) => {
  return await jwt.verify(token, process.env.JWT_SECRET);
};
