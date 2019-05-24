/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('budgets', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    num_periods: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false, tableName: 'budgets'
  });
};
