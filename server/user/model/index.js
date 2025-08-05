import UserSchema from "../schema/index.js";
class UserModel {
  async find(selectors = {}, options = {}) {
    const { limit, skip, sort } = options;
    const projection = options.projection || "-__v -password";
    return await UserSchema.find(selectors)
      .select(projection)
      .sort(sort || "-updatedAt")
      .limit(limit)
      .skip(skip || 0)
      .lean()
      .maxTimeMS(60000);
  }

  async findOne(selector = {}, projection = {}, populationList = []) {
    return await UserSchema.findOne(selector)
      .select(projection)
      .lean()
      .populate(populationList);
  }

  async findByName({
    name,
    userType,
    projection = "_id",
    limit = 10,
    skip = 0,
    sort = "-updatedAt",
  }) {
    const searchConditions = {
      userType,
      $or: [
        { firstName: { $regex: name, $options: "i" } },
        { lastName: { $regex: name, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: name,
              options: "i",
            },
          },
        },
      ],
    };

    return await UserSchema.find(searchConditions)
      .select(projection)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean()
      .maxTimeMS(60000);
  }

  async findOneWithoutLean(
    selector = {},
    projection = {},
    populationList = []
  ) {
    return await UserSchema.findOne(selector)
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

  async update(selector = {}, updateData = {}, options = {}) {
    const { upsert = false, new: returnNew = true } = options;
    const projection = options.projection || "-__v -password";
    return await UserSchema.findOneAndUpdate(
      selector,
      { $set: updateData },
      {
        new: returnNew,
        upsert,
        runValidators: true,
      }
    )
      .select(projection)
      .lean();
  }

  async createByRole(userType, payload) {
    const discriminatorModel = UserSchema.discriminators?.[userType];
    if (!discriminatorModel) {
      throw new Error(`Invalid userType discriminator: ${userType}`);
    }

    return await discriminatorModel.create({
      ...payload,
      userType,
    });
  }

  async getUserByRole(id, role) {
    const discriminator = UserSchema.discriminators?.[role];
    const user = await discriminator.findById(id).lean();

    const { password, __v, ...clean } = user;
    return clean;
  }

  async getUserByRoleExcludePassword(id, role) {
    const discriminator = UserSchema.discriminators?.[role];
    const user = await discriminator.findById(id).lean();

    const { password, __v, ...clean } = user;
    return clean;
  }

  async count(selectors = {}) {
    const result = await UserSchema.countDocuments(selectors).maxTimeMS(60000);
    return result;
  }
}

export default new UserModel();
