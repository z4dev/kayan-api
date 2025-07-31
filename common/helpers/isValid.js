export const isValidRole = (role, roles) => {
  return Object.values(roles).includes(role);
};
