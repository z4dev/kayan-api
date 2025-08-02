import mongoose from "mongoose";
import nanoid from "../../../common/utils/nanoID/index.js";
import { VISIT_STATUS } from "../helpers/constant.js";

const treatmentSchema = new mongoose.Schema({
  _id: { type: String, default: () => nanoid() },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  cost: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

const visitSchema = new mongoose.Schema({
  _id: { type: String, default: () => nanoid() },
  patientId: { type: String, required: true, ref: "User" },
  doctorId: { type: String, required: true, ref: "User" },
  scheduledDate: { type: Date, required: true },
  startedAt: { type: Date },
  endedAt: { type: Date },
  status: {
    type: String,
    enum: Object.values(VISIT_STATUS),
    default: VISIT_STATUS.SCHEDULED,
  },
  notes: { type: String, default: "" },
  treatments: [treatmentSchema],
  totalAmount: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
visitSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Update the updatedAt field before updating
visitSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Calculate total amount before saving
visitSchema.pre("save", function (next) {
  if (this.treatments && this.treatments.length > 0) {
    this.totalAmount = this.treatments.reduce((total, treatment) => {
      return total + (treatment.cost || 0);
    }, 0);
  }
  next();
});

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;
