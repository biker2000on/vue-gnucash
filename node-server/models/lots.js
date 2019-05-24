/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Lots =  sequelize.define('lots', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    account_guid: {
      type: DataTypes.TEXT,
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'guid'
      }
    },
    is_closed: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: false, tableName: 'lots'
  });

  Lots.associate = function(models) {
     Lots.hasMany(models.splits)
  }

  return Lots
};
