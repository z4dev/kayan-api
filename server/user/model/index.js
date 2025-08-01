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

  async createByRole(userType, payload) {
    const discriminatorModel = User.discriminators?.[userType];
    if (!discriminatorModel) {
      throw new Error(`Invalid userType discriminator: ${userType}`);
    }
    return await discriminatorModel.create(payload);
  }
}

export default new UserModel();
