const express = require("express");
const path = require("path");

const port = process.env.PORT || 8080;
const app = express();
const helmet = require("helmet");

app.use(helmet());
app.use(express.static(path.join(__dirname, "/dist")));

app.get("*", (req, res, next) => {
  res.sendFile(path.join(__dirname, "/dist/index.html"), null, err =>
    next(err)
  );
});

app.use((err, req, res) => {
  res.status(500).send("Aguarde, estamos melhorando nossos serviços");
});

app.listen(port);

console.log("Server Started");
