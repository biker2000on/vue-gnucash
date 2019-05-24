/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('books', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    root_account_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    root_template_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'books'
  });
};
