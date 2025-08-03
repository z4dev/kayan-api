import mongoose from "mongoose";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import nanoid from "../../../common/utils/nanoID/index.js";
import { DAYS_OF_WEEK, GENDERS, NO_ADDRESS } from "../helpers/constant.js";

const baseUserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => nanoid() },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    picture: { type: String, default: "" },
    phoneNumber: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: true },
    userType: {
      type: String,
      required: true,
      enum: Object.values(USER_ROLES),
    },
    createdAt: { type: Date, default: Date.now },
  },
  { discriminatorKey: "userType", collection: "users" }
);

const UserSchema = mongoose.model("User", baseUserSchema);

UserSchema.discriminators = {
  [USER_ROLES.PATIENT]: UserSchema.discriminator(
    USER_ROLES.PATIENT,
    new mongoose.Schema({
      gender: {
        type: String,
        enum: Object.keys(GENDERS),
      },
      dateOfBirth: Date,
      insuranceNumber: {
        type: String,
        unique: true,
        sparse: true,
      },
    })
  ),
  [USER_ROLES.DOCTOR]: UserSchema.discriminator(
    USER_ROLES.DOCTOR,
    new mongoose.Schema({
      specialty: {
        type: String,
        required: true,
      },
      clinicAddress: {
        type: String,
        required: true,
        default: NO_ADDRESS,
      },
      licenseNumber: {
        type: String,
        required: true,
      },
      aboutDoctor: {
        type: String,
        default: "",
      },
      consultationFee: {
        type: Number,
        default: 0,
      },
      availability: [
        {
          dayOfWeek: {
            type: String,
            enum: DAYS_OF_WEEK,
            required: true,
          },
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
        },
      ],
    })
  ),
  [USER_ROLES.FINANCE]: UserSchema.discriminator(
    USER_ROLES.FINANCE,
    new mongoose.Schema({})
  ),
};

export default UserSchema;
