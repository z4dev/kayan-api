import mongoose from "mongoose";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import nanoid from "../../../common/utils/nanoID/index.js";
import { GENDERS } from "../helpers/constant.js";

const options = { discriminatorKey: "userType", collection: "users" };

const baseUserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid() },
    firstName: String,
    lastName: String,
    picture: { type: String, default: "" },
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  options
);

const User = mongoose.model("User", baseUserSchema);

User.discriminators = {
  [USER_ROLES.PATIENT]: User.discriminator(
    USER_ROLES.PATIENT,
    new mongoose.Schema({
      gender: {
        type: String,
        enum: Object.keys(GENDERS),
      },
      dateOfBirth: Date,
      insuranceNumber: String,
    })
  ),
  [USER_ROLES.DOCTOR]: User.discriminator(
    USER_ROLES.DOCTOR,
    new mongoose.Schema({
      specialty: String,
      clinicAddress: String,
      licenseNumber: String,
    })
  ),
  [USER_ROLES.FINANCE]: User.discriminator(
    USER_ROLES.FINANCE,
    new mongoose.Schema({})
  ),
};

export default User;
