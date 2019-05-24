/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gnclock', {
    Hostname: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    PID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'gnclock'
  });
};
