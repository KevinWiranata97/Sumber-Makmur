'use strict';
const {
  Model
} = require('sequelize');
const { hashpassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true // Make username unique
    },
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    updatedBy: DataTypes.STRING,
    createdBy: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((instance, options) => {
    instance.password = hashpassword(instance.password)
  })
  return User;
};
