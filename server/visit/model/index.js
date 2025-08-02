import Visit from "../schema/index.js";

class VisitModel {
  async find(selectors = {}, options = {}) {
    const { limit, skip, sort, projection, populate } = options;
    let query = Visit.find(selectors);

    if (projection) query = query.select(projection);
    if (sort) query = query.sort(sort);
    if (limit) query = query.limit(limit);
    if (skip) query = query.skip(skip);
    if (populate) query = query.populate(populate);

    return await query.lean().maxTimeMS(60000);
  }

  async findOne(selector = {}, projection = {}, populationList = []) {
    let query = Visit.findOne(selector);

    if (projection && Object.keys(projection).length > 0) {
      query = query.select(projection);
    }

    if (populationList && populationList.length > 0) {
      query = query.populate(populationList);
    }

    return await query.lean();
  }

  async create(payload) {
    return await Visit.create(payload);
  }

  async updateOne(selector, update) {
    return await Visit.updateOne(selector, update);
  }

  async deleteOne(selector) {
    return await Visit.deleteOne(selector);
  }

  async countDocuments(selector = {}) {
    return await Visit.countDocuments(selector);
  }

  async aggregate(pipeline) {
    return await Visit.aggregate(pipeline);
  }
}

export default new VisitModel();
