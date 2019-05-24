/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('budget_amounts', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    budget_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    account_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    period_num: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount_denom: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    timestamps: false, tableName: 'budget_amounts'
  });
};
