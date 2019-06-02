/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jobs', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reference: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    owner_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    owner_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
underscored: true,
 tableName: 'jobs'
  });
};
