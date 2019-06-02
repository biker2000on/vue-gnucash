/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Splits = sequelize.define('splits', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    tx_guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      // references: {
      //   model: 'transactions',
      //   key: 'guid'
      // }
    },
    account_guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'guid'
      }
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
      type: DataTypes.DATEONLY,
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
      allowNull: true,
      references: {
        model: 'lots',
        key: 'guid'
      }
    }
  }, {
    timestamps: false,
    underscored: true,
    tableName: 'splits'
  });

  Splits.associate = function (models) {
    Splits.belongsTo(models.accounts, {
      foreignKey: 'account_guid'
    })
    Splits.belongsTo(models.lots, {
      foreignKey: 'lot_guid'
    })
    Splits.belongsTo(models.transactions, {
      // foreignKey: 'tx_guid',
      as: 'tx'
    })
  }

  return Splits
};