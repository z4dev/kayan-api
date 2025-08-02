import { StatusCodes } from "http-status-codes";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import ErrorResponse from "../../../common/utils/errorResponse/index.js";
import User from "../../users/model/index.js";
import { VISIT_STATUS, visitsErrors } from "../helpers/constant.js";
import Visit from "../model/index.js";

const { BAD_REQUEST, FORBIDDEN, CONFLICT } = StatusCodes;

class VisitsService {
  async createVisit(data) {
    const { patientId, doctorId, scheduledDate, notes } = data;

    // Check if patient exists
    const patient = await User.findOne({
      _id: patientId,
      userType: USER_ROLES.PATIENT,
    });
    if (!patient) {
      throw new ErrorResponse(
        visitsErrors.PATIENT_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.PATIENT_NOT_FOUND.code
      );
    }

    // Check if doctor exists
    const doctor = await User.findOne({
      _id: doctorId,
      userType: USER_ROLES.DOCTOR,
    });
    if (!doctor) {
      throw new ErrorResponse(
        visitsErrors.DOCTOR_NOT_FOUND.message,
        BAD_REQUEST,
        visitsErrors.DOCTOR_NOT_FOUND.code
      );
    }

    // Check if doctor has an active visit
    const activeVisit = await Visit.findOne({
      doctorId,
      status: { $in: [VISIT_STATUS.SCHEDULED, VISIT_STATUS.IN_PROGRESS] },
    });

    if (activeVisit) {
      throw new ErrorResponse(
        visitsErrors.DOCTOR_HAS_ACTIVE_VISIT.message,
        CONFLICT,
        visitsErrors.DOCTOR_HAS_ACTIVE_VISIT.code
      );
    }

    const visitData = {
      patientId,
      doctorId,
      scheduledDate: scheduledDate || new Date(),
      status: VISIT_STATUS.SCHEDULED,
      notes: notes || "",
      treatments: [],
      totalAmount: 0,
    };

    const visit = await Visit.create(visitData);
    return await this.getVisit(visit._id);
  }

  async listVisits(query) {
    const { page = 1, limit = 10, status, doctorId, patientId } = query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctorId = doctorId;
    if (patientId) filter.patientId = patientId;

    const visits = await Visit.find(filter, {
      limit: Number.parseInt(limit),
      skip: Number.parseInt(skip),
      sort: { createdAt: -1 },
    });

    const total = await Visit.countDocuments(filter);

    return {
      visits,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
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

    if (visit.doctorId !== doctorId) {
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

    // Check if doctor has another active visit
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

    const updatedVisit = await Visit.updateOne(
      { _id: visitId },
      {
        status: VISIT_STATUS.IN_PROGRESS,
        startedAt: new Date(),
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

    await Visit.updateOne(
      { _id: visitId },
      {
        status: VISIT_STATUS.COMPLETED,
        endedAt: new Date(),
      }
    );

    return await this.getVisit(visitId);
  }

  async addTreatment(visitId, treatmentData, doctorId) {
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

    const treatment = {
      name: treatmentData.name,
      description: treatmentData.description || "",
      cost: treatmentData.cost,
      createdAt: new Date(),
    };

    const updatedVisit = await Visit.updateOne(
      { _id: visitId },
      {
        $push: { treatments: treatment },
        $inc: { totalAmount: treatment.cost },
      }
    );

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

    const oldCost = visit.treatments[treatmentIndex].cost;
    const newCost = treatmentData.cost || oldCost;
    const costDifference = newCost - oldCost;

    const updateFields = {};
    if (treatmentData.name)
      updateFields[`treatments.${treatmentIndex}.name`] = treatmentData.name;
    if (treatmentData.description !== undefined)
      updateFields[`treatments.${treatmentIndex}.description`] =
        treatmentData.description;
    if (treatmentData.cost !== undefined)
      updateFields[`treatments.${treatmentIndex}.cost`] = treatmentData.cost;

    await Visit.updateOne(
      { _id: visitId },
      {
        $set: updateFields,
        $inc: { totalAmount: costDifference },
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

    await Visit.updateOne(
      { _id: visitId },
      {
        $pull: { treatments: { _id: treatmentId } },
        $inc: { totalAmount: -treatment.cost },
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

    await Visit.updateOne({ _id: visitId }, { notes: notesData.notes });

    return await this.getVisit(visitId);
  }

  async searchVisits(query) {
    const { doctorName, patientName, visitId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const pipeline = [];

    // Match stage for visitId if provided
    if (visitId) {
      pipeline.push({
        $match: { _id: visitId },
      });
    }

    // Lookup doctor information
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    });

    // Lookup patient information
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "patientId",
        foreignField: "_id",
        as: "patient",
      },
    });

    // Unwind the arrays
    pipeline.push({ $unwind: "$doctor" }, { $unwind: "$patient" });

    // Match stage for names if provided
    const matchConditions = {};
    if (doctorName) {
      matchConditions.$or = [
        { "doctor.firstName": { $regex: doctorName, $options: "i" } },
        { "doctor.lastName": { $regex: doctorName, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: ["$doctor.firstName", " ", "$doctor.lastName"],
              },
              regex: doctorName,
              options: "i",
            },
          },
        },
      ];
    }

    if (patientName) {
      const patientConditions = [
        { "patient.firstName": { $regex: patientName, $options: "i" } },
        { "patient.lastName": { $regex: patientName, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: {
                $concat: ["$patient.firstName", " ", "$patient.lastName"],
              },
              regex: patientName,
              options: "i",
            },
          },
        },
      ];

      if (matchConditions.$or) {
        matchConditions.$and = [
          { $or: matchConditions.$or },
          { $or: patientConditions },
        ];
        delete matchConditions.$or;
      } else {
        matchConditions.$or = patientConditions;
      }
    }

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Sort by creation date
    pipeline.push({ $sort: { createdAt: -1 } });

    // Get total count
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Visit.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    // Add pagination
    pipeline.push(
      { $skip: Number.parseInt(skip) },
      { $limit: Number.parseInt(limit) }
    );

    const visits = await Visit.aggregate(pipeline);

    return {
      visits,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
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
