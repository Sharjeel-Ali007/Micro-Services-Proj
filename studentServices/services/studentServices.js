const Student = require("../models/studentModel");
const Grade = require("../models/gradeModel");

const studentServices = {
  getAll: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const students = await Student.findAll({
      attributes: ["name", "email"],
      include: {
        model: Grade,
        as: "Grade",
        attributes: ["grade_name"],
      },
      limit,
      offset,
    });

    // for sorted results
    return students.map((student) => ({
      name: student.name,
      email: student.email,
      Grade: student.Grade?.grade_name || null,
    }));
  },

  getById: async (id) => {
    const student = await Student.findOne({
      where: { id },
      attributes: ["name", "email"],
      include: {
        model: Grade,
        as: "Grade",
        attributes: ["grade_name"],
      },
    });

    if (!student) return null;

    // for sorted results
    return {
      name: student.name,
      email: student.email,
      Grade: student.Grade?.grade_name || null,
    };
  },

  create: async (name, age, gradeId, email, photo, adminId) => {
    return await Student.create({
      name,
      age,
      email,
      photo,
      grade_id: gradeId,
      admin_id: adminId,
    });
  },

  update: async (id, name, email, age, gradeId, photo) => {
    const student = await Student.findByPk(id);
    if (!student) return null;
    student.name = name;
    student.email = email;
    student.age = age;
    student.grade_id = gradeId;
    student.photo = photo;
    await student.save();
    return student;
  },

  delete: async (id) => {
    const student = await Student.findByPk(id);
    if (student) {
      await student.destroy();
      return true;
    }
    return false;
  },
};

module.exports = studentServices;
