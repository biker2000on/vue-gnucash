/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('prices', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    commodity_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    currency_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    source: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
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
    }
  }, {
    timestamps: false,
underscored: true,
 tableName: 'prices'
  });
};
