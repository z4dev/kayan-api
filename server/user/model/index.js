import User from "../schema/index.js"; // Must be from the file that registers discriminators

class UserModel {
  async find(selectors = {}, options = {}) {
    const { limit, skip, sort, projection } = options;

    return await User.find(excludeDeleted(selectors))
      .select(projection)
      .sort(sort || "-updatedAt")
      .limit(limit)
      .skip(skip || 0)
      .lean()
      .maxTimeMS(60000);
  }

  async findOne(selector = {}, projection = {}, populationList = []) {
    return await User.findOne(selector)
      .select(projection)
      .lean()
      .populate(populationList);
  }



  async findOneAndIncludePassword(
    selector = {},
    projection = {},
    populationList = []
  ) {
    projection = { ...usersProjection, ...projection };
    return await User.findOne(excludeDeleted(selector))
      .select(projection)
      .lean()
      .populate(populationList);
  }

  async count(selectors = {}) {
    return await User.countDocuments(excludeDeleted(selectors)).maxTimeMS(
      60000
    );
  }

  async create(payload) {
    return await User.create(payload);
  }

  /**
   * Creates a user based on the discriminator (patient, doctor, finance)
   */
  async createByRole(userType, payload) {
    const discriminatorModel = User.discriminators?.[userType];
    if (!discriminatorModel) {
      throw new Error(`Invalid userType discriminator: ${userType}`);
    }
    return await discriminatorModel.create(payload);
  }

  async update(selector, newParams, options = {}) {
    return await User.findOneAndUpdate(excludeDeleted(selector), newParams, {
      runValidators: true,
      new: true,
      projection: {
        ...usersProjection,
        ...passwordProjection,
      },
      ...options,
    });
  }

  async updateMany(selector, newParams, options = {}) {
    return await User.updateMany(excludeDeleted(selector), newParams, options);
  }

  async delete(selector, options = {}) {
    return await User.deleteOne(excludeDeleted(selector), options);
  }

  async aggregate(pipeline, options = {}) {
    return await User.aggregate(pipeline, { maxTimeMS: 60000 })
      .sort(options.sort || "createdAt")
      .skip(options.skip || 0)
      .limit(options.limit || 200);
  }
}

export default new UserModel();
