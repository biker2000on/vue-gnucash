/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entries', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_entered: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    action: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quantity_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    quantity_denom: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    i_acct: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i_price_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    i_price_denom: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    i_discount_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    i_discount_denom: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    invoice: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i_disc_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i_disc_how: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    i_taxable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    i_taxincluded: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    i_taxtable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_acct: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_price_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    b_price_denom: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    bill: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_taxable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_taxincluded: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    b_taxtable: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    b_paytype: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    billable: {
      type: DataTypes.INTEGER,
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
    order_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'entries'
  });
};
