'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shelf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Shelf.init({
    shelf_name: DataTypes.STRING,
    shelf_code: DataTypes.STRING,
    storage_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
   
  }, {
    sequelize,
    modelName: 'Shelf',
    tableName: 'shelves'
  });
  return Shelf;
};