/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('taxtable_entries', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    taxtable: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    account: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    amount_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount_denom: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'taxtable_entries'
  });
};
