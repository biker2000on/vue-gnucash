/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('taxtables', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refcount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    invisible: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'taxtables'
  });
};
