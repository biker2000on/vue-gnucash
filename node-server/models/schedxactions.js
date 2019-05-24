/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('schedxactions', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enabled: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    end_date: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    last_occur: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    num_occur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rem_occur: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    auto_create: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    auto_notify: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    adv_creation: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    adv_notify: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    instance_count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    template_act_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    timestamps: false, tableName: 'schedxactions'
  });
};
