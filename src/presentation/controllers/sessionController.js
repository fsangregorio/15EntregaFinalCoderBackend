
import { decodeToken, generateToken } from "../../common/jwt.js";
import UserManager from "../../domain/managers/userManager.js";
import SessionManager from "../../domain/managers/sessionManager.js";
import loginValidation from "../../domain/validations/session/loginValidation.js";

export const signup = async (req, res, next) => {
  try {
    const manager = new SessionManager();
    const result = await manager.signup(req.body);
    return res.status(201).json({
      status: "Success",
      message: "Signup successful!",
      payload: { ...result, password: undefined },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    await loginValidation.parseAsync(req.body);
    const { email, password } = req.body;
    const manager = new SessionManager();
    const result = await manager.login(email, password);
    const accessToken = await generateToken(result);

    if (result.role === "admin") {
      req.session.admin = true;
    }

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      })
      .send({
        accessToken,
        message: "Login successful",
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.user = null;
    return res.status(200).send({ status: "Success", message: "Logout Successful" });
  } catch (error) {
    next(error);
  }
};


export const failed = (req, res) => {
  return res.status(500).send({ error: "Failed" });
};

export const current = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).send({ status: "Error", message: "You are not authorized to access" });
    }
    const decodedToken = await decodeToken(accessToken);
    const userManager = new UserManager();

    const user = await userManager.getUserById(decodedToken.user.id);
    if (!user) {
      return res.status(401).send({ status: "Error", message: "You are not authorized to access" });
    }
    return res.status(200).send({ status: "Success", payload: req.user });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const manager = new SessionManager();
    await manager.forgotPassword(email);

    return res.status(200).json({
      status: "Success",
      message: "An E-Mail has been sent to your E-Mail adress.",
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const passwords = req.body;
    const token = req.query.token;

    const manager = new SessionManager();
    const result = await manager.changePassword(token, passwords);
    if (!result) throw new Error("Error");

    return res.status(200).json({
      status: "Success",
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
