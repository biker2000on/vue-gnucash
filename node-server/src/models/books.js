/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Books = sequelize.define('books', {
    guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    root_account_guid: {
      type: DataTypes.TEXT,
      allowNull: false,
      references: {
        model: 'accounts',
        key: 'guid'
      }
    },
    root_template_guid: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    timestamps: false,
underscored: true,
 tableName: 'books'
  });

  return Books
};
