import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import ErrorResponse from "../../../common/utils/errorResponse/index.js";
import { generateToken } from "../../../common/utils/jwt/index.js";
import { getPaginationAndSortingOptions } from "../../../common/utils/pagination/index.js";
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

    if (data["insuranceNumber"]) {
      const existingInsurance = await User.findOne({
        insuranceNumber: data["insuranceNumber"],
      });
      if (existingInsurance) {
        throw new ErrorResponse(
          usersErrors.INSURANCE_NUMBER_EXISTS.message,
          BAD_REQUEST,
          usersErrors.INSURANCE_NUMBER_EXISTS.code
        );
      }
    }

    if (existing) {
      throw new ErrorResponse(
        usersErrors.EMAIL_OR_PHONE_EXISTS.message,
        BAD_REQUEST,
        usersErrors.EMAIL_OR_PHONE_EXISTS.code
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    const createdUser = await User.createByRole(USER_ROLES.PATIENT, data);

    const userObj = createdUser.toObject();
    delete userObj.password;

    const token = await generateToken(userObj);
    return { user: userObj, token };
  }

  async registerDoctor(data) {
    const { email, phoneNumber, password, licenseNumber } = data;

    const existing = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existing) {
      throw new ErrorResponse(
        usersErrors.EMAIL_OR_PHONE_EXISTS.message,
        BAD_REQUEST,
        usersErrors.EMAIL_OR_PHONE_EXISTS.code
      );
    }

    const existingLicense = await User.findOne({ licenseNumber });
    if (existingLicense) {
      throw new ErrorResponse(
        usersErrors.LICENSE_NUMBER_EXISTS.message,
        BAD_REQUEST,
        usersErrors.LICENSE_NUMBER_EXISTS.code
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    const createdUser = await User.createByRole(USER_ROLES.DOCTOR, data);

    const userObj = createdUser.toObject();
    delete userObj.password;

    const token = await generateToken(userObj);
    return { user: userObj, token };
  }

  async registerFinance(data) {
    const { email, phoneNumber, password } = data;

    const existing = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existing) {
      throw new ErrorResponse(
        usersErrors.EMAIL_OR_PHONE_EXISTS.message,
        BAD_REQUEST,
        usersErrors.EMAIL_OR_PHONE_EXISTS.code
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    const createdUser = await User.createByRole(USER_ROLES.FINANCE, data);

    const userObj = createdUser.toObject();
    delete userObj.password;

    const token = await generateToken(userObj);
    return { user: userObj, token };
  }

  async getProfile(userId) {
    const user = await User.findOneWithoutPassword({ _id: userId });

    if (!user) {
      throw new ErrorResponse(
        usersErrors.PATIENT_NOT_FOUND.message,
        NOT_FOUND,
        usersErrors.PATIENT_NOT_FOUND.code
      );
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findOneWithoutPassword({ _id: userId });
    if (!user) {
      throw new ErrorResponse(
        usersErrors.USER_NOT_FOUND.message,
        NOT_FOUND,
        usersErrors.USER_NOT_FOUND.code
      );
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.update({ _id: userId }, updateData);

    return updatedUser;
  }

  async listDoctors(query) {
    const { page, limit, skip, sortBy, sortOrder, ..._query } = query;

    const options = getPaginationAndSortingOptions(query);

    const doctors = await User.find(
      {
        userType: USER_ROLES.DOCTOR,
        ..._query,
      },
      options
    );
    const count = await User.count({
      userType: USER_ROLES.DOCTOR,
      ..._query,
    });

    return {
      doctors,
      ...options,
      count,
    };
  }

  async listPatients(query) {
    const { page, limit, skip, sortBy, sortOrder, ..._query } = query;

    const options = getPaginationAndSortingOptions(query);

    const patients = await User.find(
      {
        userType: USER_ROLES.PATIENT,
        ..._query,
      },

      options
    );

    const count = await User.count({
      userType: USER_ROLES.PATIENT,
      ..._query,
    });

    return {
      patients,
      ...options,
      count,
    };
  }

  async getDoctor(id) {
    const doctor = await User.findOneWithoutPassword({
      _id: id,
      userType: USER_ROLES.DOCTOR,
    });
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
    const patient = await User.findOneWithoutPassword({
      _id: id,
      userType: USER_ROLES.PATIENT,
    });
    if (!patient) {
      throw new ErrorResponse(
        usersErrors.PATIENT_NOT_FOUND.message,
        BAD_REQUEST,
        usersErrors.PATIENT_NOT_FOUND.code
      );
    }
    return patient;
  }

  async updateAvailability(userId, data) {
    const { availability } = data;

    const doctor = await User.findOneWithoutLean(
      {
        _id: userId,
        userType: USER_ROLES.DOCTOR,
      },
      "-password"
    );

    if (!doctor) {
      throw new ErrorResponse(
        usersErrors.DOCTOR_NOT_FOUND.message,
        BAD_REQUEST,
        usersErrors.DOCTOR_NOT_FOUND.code
      );
    }

    if (!Array.isArray(availability)) {
      throw new ErrorResponse(
        usersErrors.INVALID_AVAILABILITY.message,
        BAD_REQUEST,
        usersErrors.INVALID_AVAILABILITY.code
      );
    }

    doctor["availability"] = availability;
    await doctor.save();
    return doctor;
  }
}

export default new UsersService();
