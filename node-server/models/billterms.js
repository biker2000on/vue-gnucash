/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('billterms', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    refcount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    invisible: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duedays: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discountdays: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    discount_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    discount_denom: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    cutoff: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'billterms'
  });
};
