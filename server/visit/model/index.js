import VisitSchema from "../schema/index.js";
class Visit {
  async find(selectors = {}, options = {}) {
    const { limit, skip, sort, projection } = options;
    return await VisitSchema.find(selectors)
      .select(projection)
      .sort(sort || "-updatedAt")
      .limit(limit)
      .skip(skip || 0)
      .lean()
      .maxTimeMS(60000);
  }

  async findOne(selector = {}, projection = {}, populationList = []) {
    return await VisitSchema.findOne(selector)
      .select(projection)
      .lean()
      .populate(populationList);
  }

  async findWithPopulation(filter = {}, options = {}, populate = []) {
    const { limit, skip, sort, projection } = options;

    return await VisitSchema.find(filter)
      .select(projection || "-__v")
      .populate(populate)
      .sort(sort || "-createdAt")
      .limit(limit || 10)
      .skip(skip || 0)
      .lean()
      .maxTimeMS(60000);
  }

  async updateOne(selector = {}, update = {}, options = {}) {
    options = {
      new: true,
      upsert: false,
      runValidators: true,
      ...options,
    };
    return await VisitSchema.updateOne(selector, update, options);
  }

  async findOneWithoutLean(
    selector = {},
    projection = {},
    populationList = []
  ) {
    return await VisitSchema.findOne(selector)
      .select(projection)
      .populate(populationList);
  }

  async findOneWithoutPassword(
    selector = {},
    projection = {},
    populationList = []
  ) {
    return await this.findOne(selector, projection, populationList);
  }

  async create(payload) {
    return await VisitSchema.create(payload);
  }

  async update(selector = {}, updateData = {}, options = {}) {
    const { upsert = false, new: returnNew = true } = options;
    return await VisitSchema.findOneAndUpdate(
      selector,
      { $set: updateData },
      {
        new: returnNew,
        upsert,
        runValidators: true,
      }
    )
      .select("-__v -password")
      .lean();
  }

  async createByRole(userType, payload) {
    const discriminatorModel = VisitSchema.discriminators?.[userType];
    if (!discriminatorModel) {
      throw new Error(`Invalid userType discriminator: ${userType}`);
    }

    return await discriminatorModel.create({
      ...payload,
      userType,
    });
  }

  async getUserByRole(id, role) {
    const discriminator = VisitSchema.discriminators?.[role];
    const user = await discriminator.findById(id).lean();

    const { password, __v, ...clean } = user;
    return clean;
  }

  async getUserByRoleExcludePassword(id, role) {
    const discriminator = VisitSchema.discriminators?.[role];
    const user = await discriminator.findById(id).lean();

    const { password, __v, ...clean } = user;
    return clean;
  }

  async count(selectors = {}) {
    const result = await VisitSchema.countDocuments(selectors).maxTimeMS(60000);
    return result;
  }
}

export default new Visit();
