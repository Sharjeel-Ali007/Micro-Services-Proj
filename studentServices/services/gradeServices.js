const Grade = require("../models/gradeModel");

const gradeServices = {
  getAll: async () => {
    return await Grade.findAll();
  },

  getByName: async (grade_name) => {
    return await Grade.findOne({ where: { grade_name } });
  },

  seedInitialGrades: async () => {
    try {
      await Grade.bulkCreate(
        [
          { grade_name: "A" },
          { grade_name: "B" },
          { grade_name: "C" },
          { grade_name: "D" },
          { grade_name: "F" },
        ],
        {
          ignoreDuplicates: true,
        }
      );
      console.log("Default grades inserted");
    } catch (err) {
      console.error("Error inserting default grades:", err);
    }
  },
};

module.exports = gradeServices;
