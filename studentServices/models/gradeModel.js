const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Grade = sequelize.define(
  "Grade",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    grade_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "grades",
    timestamps: false,
  }
);

module.exports = Grade;
