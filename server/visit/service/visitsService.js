import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import ErrorResponse from "../../../common/utils/errorResponse/index.js";
import { getPaginationAndSortingOptions } from "../../../common/utils/pagination/index.js";
import { usersErrors } from "../../user/helpers/constant.js";
import User from "../../user/model/index.js";
import { VISIT_STATUS, visitsErrors } from "../helpers/constant.js";
import Visit from "../model/index.js";

const { BAD_REQUEST, FORBIDDEN, CONFLICT } = StatusCodes;

class VisitsService {
  async createVisit(userId, data) {
    const { doctorId, scheduledDate, scheduledTime } = data;

    const patient = await User.findOne({
      _id: userId,
      userType: USER_ROLES.PATIENT,
    });

    if (!patient) {
      throw new ErrorResponse(
        usersErrors.PATIENT_NOT_FOUND.message,
        BAD_REQUEST,
        usersErrors.PATIENT_NOT_FOUND.code
      );
    }

    const doctor = await User.findOne({
      _id: doctorId,
      userType: USER_ROLES.DOCTOR,
    });

    if (!doctor) {
      throw new ErrorResponse(
        usersErrors.DOCTOR_NOT_FOUND.message,
        BAD_REQUEST,
        usersErrors.DOCTOR_NOT_FOUND.code
      );
    }

    const date = new Date(scheduledDate);
    const [hT, mT] = scheduledTime.split(":").map(Number);
    const requestedStart = new Date(date);
    requestedStart.setHours(hT, mT, 0, 0);
    const requestedEnd = new Date(requestedStart.getTime() + 30 * 60000);

    const now = new Date();
    if (requestedStart < now) {
      const formattedNow = now.toTimeString().slice(0, 5);
      const formattedDay = now.toLocaleDateString("en-US", { weekday: "long" });
      throw new ErrorResponse(
        visitsErrors.VISIT_TIME_IN_PAST.message(formattedNow, formattedDay),
        BAD_REQUEST,
        visitsErrors.VISIT_TIME_IN_PAST.code
      );
    }

    const dayOfWeek = requestedStart.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const matchingSlot = doctor.availability?.find((slot) => {
      if (slot.dayOfWeek !== dayOfWeek) return false;

      const [startH, startM] = slot.startTime.split(":").map(Number);
      const [endH, endM] = slot.endTime.split(":").map(Number);

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const visitMinutes = hT * 60 + mT;

      return visitMinutes >= startMinutes && visitMinutes + 30 <= endMinutes;
    });

    if (!matchingSlot) {
      throw new ErrorResponse(
        visitsErrors.DOCTOR_HAS_ALREADY_ACTIVE_VISIT.message(
          dayOfWeek,
          scheduledTime
        ),
        BAD_REQUEST,
        visitsErrors.DOCTOR_HAS_ALREADY_ACTIVE_VISIT.code
      );
    }

    const startOfDay = new Date(requestedStart);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedStart);
    endOfDay.setHours(23, 59, 59, 999);

    const existingVisits = await Visit.find({
      doctorId,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: [VISIT_STATUS.SCHEDULED, VISIT_STATUS.IN_PROGRESS] },
    });

    const busySlots = [];

    const hasConflict = existingVisits.some((visit) => {
      const [cH, cM] = visit.scheduledTime.split(":").map(Number);
      const conflictStart = new Date(date);
      conflictStart.setHours(cH, cM, 0, 0);
      const conflictEnd = new Date(conflictStart.getTime() + 30 * 60000);

      const formattedStart = conflictStart.toTimeString().slice(0, 5);
      const formattedEnd = conflictEnd.toTimeString().slice(0, 5);
      busySlots.push(`${formattedStart}–${formattedEnd}`);

      return requestedStart < conflictEnd && requestedEnd > conflictStart;
    });

    if (hasConflict) {
      throw new ErrorResponse(
        visitsErrors.DOCTOR_TIME_SLOT_TAKEN.message(
          scheduledTime,
          dayOfWeek,
          busySlots
        ),
        CONFLICT,
        visitsErrors.DOCTOR_TIME_SLOT_TAKEN.code
      );
    }

    const visit = await Visit.create({
      patientId: patient._id,
      doctorId,
      scheduledDate: date,
      scheduledTime,
      status: VISIT_STATUS.SCHEDULED,
      treatments: [],
      totalAmount: 0,
      medicalNotes: "",
    });

    return await this.getVisit(visit._id);
  }

  async listVisits(userId, query) {
    const { page, limit, skip, sortBy, sortOrder, ..._query } = query;

    const options = getPaginationAndSortingOptions(query);

    const filter = {};

    const currentUser = await User.findOne({
      _id: userId,
      userType: { $in: [USER_ROLES.DOCTOR, USER_ROLES.PATIENT] },
    });

    if (!currentUser) {
      throw new ErrorResponse(
        usersErrors.USER_NOT_FOUND.message,
        BAD_REQUEST,
        usersErrors.USER_NOT_FOUND.code
      );
    }
    if (currentUser.userType === USER_ROLES.DOCTOR) {
      filter.doctorId = userId;
    } else if (currentUser.userType === USER_ROLES.PATIENT) {
      filter.patientId = userId;
    }
    const _queryWithFilter = { ..._query, ...filter };

    const visits = await Visit.find(_queryWithFilter, options);

    const count = await Visit.count(_queryWithFilter);

    return {
      visits,
      ...options,
      totalPages: Math.ceil(count / options["limit"]),
      count,
    };
  }

  async getVisit(id) {
    const visit = await Visit.findOne({ _id: id });
    if (!visit) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_FOUND.code
      );
    }
    return visit;
  }

  async startVisit(visitId, doctorId) {
    const visit = await Visit.findOne({ _id: visitId });

    if (!visit) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_FOUND.code
      );
    }

    if (visit.doctorId.toString() !== doctorId.toString()) {
      throw new ErrorResponse(
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.message,
        FORBIDDEN,
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.code
      );
    }

    if (visit.status !== VISIT_STATUS.SCHEDULED) {
      throw new ErrorResponse(
        visitsErrors.VISIT_CANNOT_BE_STARTED.message,
        BAD_REQUEST,
        visitsErrors.VISIT_CANNOT_BE_STARTED.code
      );
    }

    const activeVisit = await Visit.findOne({
      doctorId,
      status: VISIT_STATUS.IN_PROGRESS,
      _id: { $ne: visitId },
    });

    if (activeVisit) {
      throw new ErrorResponse(
        visitsErrors.DOCTOR_HAS_ACTIVE_VISIT.message,
        CONFLICT,
        visitsErrors.DOCTOR_HAS_ACTIVE_VISIT.code
      );
    }

    const [hour, minute] = visit.scheduledTime.split(":").map(Number);
    const scheduledStart = new Date(visit.scheduledDate);
    scheduledStart.setHours(hour, minute, 0, 0);

    const now = new Date();

    const dayOfWeek = scheduledStart.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (now < scheduledStart) {
      throw new ErrorResponse(
        visitsErrors.VISIT_TIME_AND_DATE_BEFORE_NOW.message(
          visit.scheduledTime,
          dayOfWeek
        ),
        BAD_REQUEST,
        visitsErrors.VISIT_TIME_AND_DATE_BEFORE_NOW.code
      );
    }

    await Visit.update(
      { _id: visitId },
      {
        status: VISIT_STATUS.IN_PROGRESS,
        startedAt: now,
      }
    );

    return await this.getVisit(visitId);
  }

  async endVisit(visitId, doctorId) {
    const visit = await Visit.findOne({ _id: visitId });
    if (!visit) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_FOUND.code
      );
    }

    if (visit.doctorId !== doctorId) {
      throw new ErrorResponse(
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.message,
        FORBIDDEN,
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.code
      );
    }

    if (visit.status !== VISIT_STATUS.IN_PROGRESS) {
      throw new ErrorResponse(
        visitsErrors.VISIT_CANNOT_BE_ENDED.message,
        BAD_REQUEST,
        visitsErrors.VISIT_CANNOT_BE_ENDED.code
      );
    }

    await Visit.update(
      { _id: visitId },
      {
        status: VISIT_STATUS.COMPLETED,
        endedAt: new Date(),
      }
    );

    return await this.getVisit(visitId);
  }

  // treatment management methods

  async addTreatment(visitId, treatmentData, doctorId) {
    const visit = await Visit.findOneWithoutLean({ _id: visitId });

    if (!visit) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_FOUND.code
      );
    }

    if (visit.doctorId !== doctorId) {
      throw new ErrorResponse(
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.message,
        FORBIDDEN,
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.code
      );
    }

    if (visit.status !== VISIT_STATUS.IN_PROGRESS) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_IN_PROGRESS.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_IN_PROGRESS.code
      );
    }

    const quantity = treatmentData.quantity ?? 1;
    const name = treatmentData.name.trim();
    const description = (treatmentData.description ?? "").trim();

    const existingTreatment = visit.treatments.find(
      (t) => t.name === name && t.description === description
    );

    if (existingTreatment) {
      await Visit.updateOne(
        {
          _id: visitId,
          "treatments.name": name,
          "treatments.description": description,
        },
        {
          $inc: {
            "treatments.$.quantity": quantity,
            totalAmount: treatmentData.cost * quantity,
          },
        }
      );
    } else {
      const newTreatment = {
        name,
        description,
        cost: treatmentData.cost,
        quantity,
        createdAt: new Date(),
      };

      await Visit.updateOne(
        { _id: visitId },
        {
          $push: { treatments: newTreatment },
          $inc: { totalAmount: newTreatment.cost * quantity },
        }
      );
    }

    return await this.getVisit(visitId);
  }

  async updateTreatment(visitId, treatmentId, treatmentData, doctorId) {
    const visit = await Visit.findOne({ _id: visitId });
    if (!visit) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_FOUND.code
      );
    }

    if (visit.doctorId !== doctorId) {
      throw new ErrorResponse(
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.message,
        FORBIDDEN,
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.code
      );
    }

    if (visit.status !== VISIT_STATUS.IN_PROGRESS) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_IN_PROGRESS.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_IN_PROGRESS.code
      );
    }

    const treatmentIndex = visit.treatments.findIndex(
      (t) => t._id.toString() === treatmentId
    );

    if (treatmentIndex === -1) {
      throw new ErrorResponse(
        visitsErrors.TREATMENT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.TREATMENT_NOT_FOUND.code
      );
    }

    const oldTreatment = visit.treatments[treatmentIndex];
    const oldTotal = oldTreatment.cost * (oldTreatment.quantity ?? 1);

    const newCost = treatmentData.cost ?? oldTreatment.cost;
    const newQuantity = treatmentData.quantity ?? oldTreatment.quantity ?? 1;
    const newTotal = newCost * newQuantity;

    const updateFields = {};
    if (treatmentData.name)
      updateFields[`treatments.${treatmentIndex}.name`] = treatmentData.name;
    if (treatmentData.description !== undefined)
      updateFields[`treatments.${treatmentIndex}.description`] =
        treatmentData.description;
    if (treatmentData.cost !== undefined)
      updateFields[`treatments.${treatmentIndex}.cost`] = treatmentData.cost;
    if (treatmentData.quantity !== undefined)
      updateFields[`treatments.${treatmentIndex}.quantity`] =
        treatmentData.quantity;

    await Visit.updateOne(
      { _id: visitId },
      {
        $set: updateFields,
        $inc: { totalAmount: newTotal - oldTotal },
      }
    );

    return await this.getVisit(visitId);
  }

  async removeTreatment(visitId, treatmentId, doctorId) {
    const visit = await Visit.findOne({ _id: visitId });
    if (!visit) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_FOUND.code
      );
    }

    if (visit.doctorId !== doctorId) {
      throw new ErrorResponse(
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.message,
        FORBIDDEN,
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.code
      );
    }

    if (visit.status !== VISIT_STATUS.IN_PROGRESS) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_IN_PROGRESS.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_IN_PROGRESS.code
      );
    }

    const treatment = visit.treatments.find(
      (t) => t._id.toString() === treatmentId
    );

    if (!treatment) {
      throw new ErrorResponse(
        visitsErrors.TREATMENT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.TREATMENT_NOT_FOUND.code
      );
    }

    const totalDeduction = (treatment.cost ?? 0) * (treatment.quantity ?? 1);

    await Visit.updateOne(
      { _id: visitId },
      {
        $pull: { treatments: { _id: treatmentId } },
        $inc: { totalAmount: -totalDeduction },
      }
    );

    return await this.getVisit(visitId);
  }

  async updateVisitNotes(visitId, notesData, doctorId) {
    const visit = await Visit.findOne({ _id: visitId });
    if (!visit) {
      throw new ErrorResponse(
        visitsErrors.VISIT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.VISIT_NOT_FOUND.code
      );
    }

    if (visit.doctorId !== doctorId) {
      throw new ErrorResponse(
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.message,
        FORBIDDEN,
        visitsErrors.UNAUTHORIZED_VISIT_ACCESS.code
      );
    }

    if (
      ![VISIT_STATUS.IN_PROGRESS, VISIT_STATUS.COMPLETED].includes(visit.status)
    ) {
      throw new ErrorResponse(
        visitsErrors.CANNOT_EDIT_NOTES_IN_THIS_STATUS.message(visit.status),
        BAD_REQUEST,
        visitsErrors.CANNOT_EDIT_NOTES_IN_THIS_STATUS.code
      );
    }

    await Visit.update({ _id: visitId }, { medicalNotes: notesData.notes });

    return await this.getVisit(visitId);
  }

  async searchVisits(query = {}) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      doctorName,
      patientName,
      visitId,
      ...filters
    } = query;

    const options = getPaginationAndSortingOptions({
      page,
      limit,
      sortBy,
      sortOrder,
    });
    const filter = { ...filters };

    if (visitId) {
      filter._id = visitId;
    }

    if (doctorName) {
      const doctors = await User.findByName({
        name: doctorName,
        userType: USER_ROLES.DOCTOR,
      });

      filter.doctorId = { $in: doctors.map((doc) => doc._id) };
    }

    if (patientName) {
      const patients = await User.findByName({
        name: patientName,
        userType: USER_ROLES.PATIENT,
      });

      filter.patientId = { $in: patients.map((p) => p._id) };
    }

    const visits = await Visit.findWithPopulation(filter, options, [
      {
        path: "doctorId",
        select:
          "firstName lastName email phoneNumber userType specialty clinicAddress",
      },
      {
        path: "patientId",
        select: "firstName lastName email phoneNumber userType",
      },
    ]);

    const count = await Visit.count(filter);

    return {
      visits,
      ...options,
      count,
      totalPages: Math.ceil(count / options.limit),
    };
  }

  async getDoctorActiveVisit(doctorId) {
    const activeVisit = await Visit.findOne({
      doctorId,
      status: { $in: [VISIT_STATUS.SCHEDULED, VISIT_STATUS.IN_PROGRESS] },
    });

    return activeVisit;
  }

  async getPatientVisits(patientId) {
    return await Visit.find(
      { patientId },
      {
        sort: { createdAt: -1 },
      }
    );
  }

  async getDoctorVisits(doctorId) {
    return await Visit.find(
      { doctorId },
      {
        sort: { createdAt: -1 },
      }
    );
  }
}

export default new VisitsService();
