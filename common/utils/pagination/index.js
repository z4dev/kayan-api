export const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const getSortingParams = (query) => {
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const sort = { [sortBy]: sortOrder };
  return sort;
};

export const getPaginationAndSortingOptions = (query) => {
  const {
    page: _page,
    limit: _limit,
    sortBy: _sortBy,
    sortOrder: _sortOrder,
    ..._query
  } = query;

  const { page, limit, skip } = getPaginationParams(query);
  const sort = getSortingParams(query);

  return { limit, skip, sort, page };
};
