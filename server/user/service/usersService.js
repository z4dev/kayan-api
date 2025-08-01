import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import ErrorResponse from "../../../common/utils/errorResponse/index.js";
import { generateToken } from "../../../common/utils/jwt/index.js";
import { usersErrors } from "../helpers/constant.js";
import User from "../model/index.js";

const { BAD_REQUEST, UNAUTHORIZED } = StatusCodes;

class UsersService {
  async login(body) {
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorResponse(
        usersErrors.INVALID_CREDENTIALS.message,
        UNAUTHORIZED,
        usersErrors.INVALID_CREDENTIALS.code
      );
    }

    if (!user.isVerified) {
      throw new ErrorResponse(
        usersErrors.PATIENT_NOT_FOUND.message,
        UNAUTHORIZED,
        usersErrors.PATIENT_NOT_FOUND.code
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ErrorResponse(
        usersErrors.INVALID_CREDENTIALS.message,
        UNAUTHORIZED,
        usersErrors.INVALID_CREDENTIALS.code
      );
    }

    const token = await generateToken(user);

    return { user, token };
  }

  async registerPatient(data) {
    const { email, phoneNumber, password } = data;

    const existing = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existing) {
      throw new ErrorResponse("Email or phone already exists", BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    const createdUser = await User.createByRole(USER_ROLES.PATIENT, data);

    const userObj = createdUser.toObject();
    delete userObj.password;

    const token = await generateToken(userObj);
    return { user: userObj, token };
  }

  /**
   * Admin creates doctor
   */
  async createDoctor(data) {
    return await this._createRoleUser(data, USER_ROLES.DOCTOR);
  }

  /**
   * Admin creates finance user
   */
  async createFinance(data) {
    return await this._createRoleUser(data, USER_ROLES.FINANCE);
  }

  async _createRoleUser(data, role) {
    const { email, phoneNumber, password } = data;

    const existing = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existing) {
      throw new ErrorResponse("Email or phone already exists", BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    const createdUser = await User.discriminators[role].create(data);

    const userObj = createdUser.toObject();
    delete userObj.password;

    return userObj;
  }

  async getUser(id) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new ErrorResponse("User not found", BAD_REQUEST);
    }
    return user;
  }

  async listUsers(query) {
    return await User.find(query).select("-password");
  }

  async listDoctors() {
    return await User.find({ userType: USER_ROLES.DOCTOR }).select("-password");
  }

  async listPatients() {
    return await User.find({ userType: USER_ROLES.PATIENT }).select(
      "-password"
    );
  }

  async getDoctor(id) {
    const doctor = await User.findOne({
      _id: id,
      userType: USER_ROLES.DOCTOR,
    }).select("-password");
    if (!doctor) {
      throw new ErrorResponse(
        usersErrors.DOCTOR_NOT_FOUND.message,
        BAD_REQUEST,
        usersErrors.DOCTOR_NOT_FOUND.code
      );
    }
    return doctor;
  }

  async getPatient(id) {
    const patient = await User.findOne({
      _id: id,
      userType: USER_ROLES.PATIENT,
    }).select("-password");
    if (!patient) {
      throw new ErrorResponse(
        usersErrors.PATIENT_NOT_FOUND.message,
        BAD_REQUEST,
        usersErrors.PATIENT_NOT_FOUND.code
      );
    }
    return patient;
  }
}

export default new UsersService();
