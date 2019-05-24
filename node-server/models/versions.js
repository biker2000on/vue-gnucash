/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('versions', {
    table_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    table_version: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false, tableName: 'versions'
  });
};
