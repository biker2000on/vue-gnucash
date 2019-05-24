/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customers', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    discount_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    discount_denom: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    credit_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    credit_denom: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tax_override: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    addr_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr_addr1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr_addr2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr_addr3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr_addr4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr_phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr_fax: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    addr_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_addr1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_addr2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_addr3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_addr4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_phone: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_fax: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    shipaddr_email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tax_included: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    taxtable: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false, tableName: 'customers'
  });
};
