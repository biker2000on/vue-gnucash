/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('slots', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    obj_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    slot_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    int64_val: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    string_val: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    double_val: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    timespec_val: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    guid_val: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    numeric_val_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    numeric_val_denom: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    gdate_val: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: false,
underscored: true,
 tableName: 'slots'
  });
};
