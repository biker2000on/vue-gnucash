/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('recurrences', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    obj_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    recurrence_mult: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recurrence_period_type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    recurrence_period_start: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    recurrence_weekend_adjust: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'recurrences'
  });
};
