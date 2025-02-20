const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser"),
  { body: e, validationResult: s } = require("express-validator"),
  Compra = require("./models/compra"),
  sequelize = require("./config/database");
require("dotenv").config();
const app = express(),
  port = process.env.PORT || 3e3,
  allowedOrigins = process.env.ALLOWED_ORIGINS.split(","),
  corsOptions = {
    origin: function (e, s) {
      if (!e || -1 !== allowedOrigins.indexOf(e)) return s(null, !0);
      s(Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: !0,
  };

function errorHandler(e, s, r, o) {
  console.error(e.stack),
    r.status(500).json({
      error: e.message,
    });
}
app.use(cors(corsOptions)),
  app.use(bodyParser.json()),
  app.use((e, s, r) => {
    s.setHeader("X-Content-Type-Options", "nosniff"),
      s.setHeader("X-Frame-Options", "DENY"),
      s.setHeader("X-XSS-Protection", "1; mode=block"),
      s.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      ),
      r();
  }),
  app.get("/compras", async (e, s) => {
    try {
      let r = await Compra.findAll();
      s.json(r);
    } catch (o) {
      s.status(500).json({
        error: o.message,
      });
    }
  }),
  app.post(
    "/compras",
    [
      e("nombreComprador")
        .notEmpty()
        .withMessage("Nombre del comprador es requerido"),
      e("numeroPuesto")
        .isInt()
        .withMessage("N\xfamero de puesto debe ser un entero"),
      e("nombreResponsable")
        .notEmpty()
        .withMessage("Nombre del responsable es requerido"),
    ],
    async (e, r) => {
      let o = s(e);
      if (!o.isEmpty())
        return r.status(400).json({
          errors: o.array(),
        });
      try {
        let {
            nombreComprador: a,
            numeroPuesto: t,
            nombreResponsable: n,
          } = e.body,
          p = await Compra.create({
            nombreComprador: a,
            numeroPuesto: t,
            nombreResponsable: n,
          });
        r.json(p);
      } catch (i) {
        r.status(500).json({
          error: i.message,
        });
      }
    }
  ),
  app.delete("/compras/:numeroPuesto", async (e, s) => {
    try {
      let { numeroPuesto: r } = e.params;
      await Compra.destroy({
        where: {
          numeroPuesto: r,
        },
      }),
        s.json({
          message: "Compra eliminada",
        });
    } catch (o) {
      s.status(500).json({
        error: o.message,
      });
    }
  }),
  app.use(errorHandler),
  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
