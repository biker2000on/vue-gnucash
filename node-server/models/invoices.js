/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invoices', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_opened: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_posted: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    owner_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    owner_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billing_id: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    post_txn: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    post_lot: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    post_acc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    billto_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    billto_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    charge_amt_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    charge_amt_denom: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'invoices'
  });
};
