/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('accounts', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    account_type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    commodity_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    commodity_scu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    non_std_scu: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent_guid: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hidden: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    placeholder: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'accounts'
  });
};
