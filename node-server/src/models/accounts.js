/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Accounts = sequelize.define('accounts', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
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
      allowNull: true,
      references: {
        model: 'commodities',
        key: 'guid'
      }
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
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'guid'
      }
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
    timestamps: false,
    underscored: true,
    tableName: 'accounts',
  });

  Accounts.associate = function (models) {
    Accounts.hasMany(models.splits)
    Accounts.belongsTo(Accounts, {
      as: 'parent',
      foreignKey: 'parent_guid'
    })
    Accounts.hasMany(Accounts, {
      as: 'children',
      foreignKey: 'parent_guid'
    })
  }

  return Accounts
};