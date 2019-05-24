/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lots', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    account_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_closed: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'lots'
  });
};
