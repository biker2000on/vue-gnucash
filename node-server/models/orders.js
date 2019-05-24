/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    reference: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_opened: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date_closed: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    owner_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    owner_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'orders'
  });
};
