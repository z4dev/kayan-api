import User from "../schema/index.js";

class UserModel {
  _buildProjection(base = {}) {
    return { ...base, password: 0, __v: 0 };
  }

  async find(selectors = {}, options = {}) {
    const { limit, skip, sort, projection } = options;

    return await User.find(excludeDeleted(selectors))
      .select(this._buildProjection(projection))
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

  async findOneWithoutPassword(
    selector = {},
    projection = {},
    populationList = []
  ) {
    return await this.findOne(
      selector,
      this._buildProjection(projection),
      populationList
    );
  }

  async update(selector = {}, updateData = {}, options = {}) {
    const { upsert = false, new: returnNew = true } = options;
    return await User.findOneAndUpdate(
      selector,
      { $set: updateData },
      {
        new: returnNew,
        upsert,
        runValidators: true,
      }
    )
      .select(this._buildProjection())
      .lean();
  }
  

  async createByRole(userType, payload) {
    const discriminatorModel = User.discriminators?.[userType];
    if (!discriminatorModel) {
      throw new Error(`Invalid userType discriminator: ${userType}`);
    }

    return await discriminatorModel.create({
      ...payload,
      userType,
    });
  }

  async getUserByRole(id, role) {
    const discriminator = User.discriminators?.[role];
    console.log(discriminator);
    const user = await discriminator.findById(id).lean();
    console.log(user);

    const { password, __v, ...clean } = user;
    return clean;
  }

  async getUserByRoleExcludePassword(id, role) {
    const discriminator = User.discriminators?.[role];
    console.log(discriminator);
    const user = await discriminator.findById(id).lean();
    console.log(user);

    const { password, __v, ...clean } = user;
    return clean;
  }
}

export default new UserModel();
