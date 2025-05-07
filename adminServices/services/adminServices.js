const Admin = require("../models/adminModel");

const adminService = {
  create: async (name, email, password, photo) => {
    return await Admin.create({ name, email, password, photo });
  },

  findByEmail: async (email) => {
    return await Admin.findOne({ where: { email } });
  },

  getAll: async () => {
    return await Admin.findAll({
      attributes: ["id", "name", "email", "photo"],
    });
  },
};

module.exports = adminService;
