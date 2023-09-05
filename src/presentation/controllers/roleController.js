
import RoleManager from "../../domain/managers/roleManager.js";
import { validationResult } from "express-validator";

const getRoles = async (req, res, next) => {
  try {
    const manager = new RoleManager();
    const roles = await manager.getRoles(req.query);
    return res.status(200).json({
      status: "Success",
      payload: roles,
    });
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const manager = new RoleManager();
    const role = await manager.getRoleById(req.params.id);
    return res.status(200).json({
      status: "Success",
      payload: role,
    });
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const manager = new RoleManager();
    const roleExist = await manager.getRoleByName(req.body.name);
    if (roleExist) {
      return res.status(400).json({
        status: "Error",
        message: "Role already exists",
      });
    }
    const role = await manager.createRole(req.body);
    return res.status(201).json({
      status: "Success",
      payload: role,
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const manager = new RoleManager();
    const role = await manager.updateRole(req.params.id, req.body);
    return res.status(200).json({
      status: "Success",
      payload: role,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const manager = new RoleManager();
    await manager.deleteRole(req.params.id);
    return res.status(200).json({
      status: "Success",
      message: "Role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
export { getRoles, getRoleById, createRole, updateRole, deleteRole };
