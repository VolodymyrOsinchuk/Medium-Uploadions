const express = require("express");
const morgan = require("morgan");
const port = process.env.PORT || 5000;

const productRoutes = require("./src/routes/productRoutes");
const connectDB = require("./src/config/db");

const app = express();

app.use(express.static(`${__dirname}/uploads`));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welkome from back");
});

app.use("/api/v1/products", productRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  connectDB();
});
