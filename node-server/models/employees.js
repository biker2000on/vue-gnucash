/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employees', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    language: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    acl: {
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
    ccard_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    workday_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    workday_denom: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rate_num: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    rate_denom: {
      type: DataTypes.BIGINT,
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
    }
  }, {
    timestamps: false, tableName: 'employees'
  });
};
