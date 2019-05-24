/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Transactions = sequelize.define('transactions', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    currency_guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'commodities',
        key: 'guid'
      }
    },
    num: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    post_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    enter_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.NOW
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false, tableName: 'transactions'
  });

  Transactions.associate = function(models) {
    Transactions.hasMany(models.splits)
    Transactions.hasOne(models.commodities)
  }

  return Transactions
};
