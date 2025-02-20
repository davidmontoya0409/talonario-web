const { Model: e, DataTypes: l } = require("sequelize"),
  sequelize = require("../config/database");
class Compra extends e {}
Compra.init(
  {
    nombreComprador: {
      type: l.STRING,
      allowNull: !1,
    },
    numeroPuesto: {
      type: l.INTEGER,
      allowNull: !1,
      unique: !0,
    },
    nombreResponsable: {
      type: l.STRING,
      allowNull: !1,
    },
  },
  {
    sequelize,
    modelName: "Compra",
    tableName: "compras",
  }
),
  (module.exports = Compra);
