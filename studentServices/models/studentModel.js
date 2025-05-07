const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Grade = require("./gradeModel");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    age: {
      type: DataTypes.TINYINT,
    },
    photo: {
      type: DataTypes.STRING,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    timestamps: false,
  }
);

// Relationships
Student.belongsTo(Grade, {
  foreignKey: "grade_id",
  as: "Grade",
  onDelete: "SET NULL",
});

module.exports = Student;
