/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commodities', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    namespace: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mnemonic: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fullname: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cusip: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fraction: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quote_flag: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quote_source: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    quote_tz: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false, tableName: 'commodities'
  });
};
