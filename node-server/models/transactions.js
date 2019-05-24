/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    currency_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    num: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    post_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enter_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'transactions'
  });
};
