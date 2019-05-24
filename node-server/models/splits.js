/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('splits', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    tx_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    account_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    action: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reconcile_state: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reconcile_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    value_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    value_denom: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    quantity_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    quantity_denom: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    lot_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'splits'
  });
};
