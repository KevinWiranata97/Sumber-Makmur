'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expedition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
 Expedition.init({
    expedition_name: DataTypes.STRING,
    expedition_address: DataTypes.STRING,
    expedition_contact: DataTypes.STRING,
    expedition_phone: DataTypes.STRING,
    expedition_fax: DataTypes.STRING,
    expedition_destination: DataTypes.STRING,
    status:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Expedition',
  });
  return Expedition;
};