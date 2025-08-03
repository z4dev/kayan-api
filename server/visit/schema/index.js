const mongoose = require("mongoose");
import nanoid from "../../../common/utils/nanoID";
import { VISIT_STATUS } from "../helpers/constant";

const visitSchema = new mongoose.Schema({
  _id: { type: String, default: () => nanoid() },
  patientId: {
    type: String,
    ref: "User",
    required: true,
  },
  doctorId: {
    type: String,
    ref: "User",
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(VISIT_STATUS),
    default: VISIT_STATUS["PENDING"],
  },
  treatments: [
    {
      name: { type: String, required: true },
      description: { type: String },
      cost: { type: Number, required: true },
    },
  ],
  medicalNotes: { type: String },
  totalAmount: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
