const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const {
  create,
  update,
  getAll,
  getOne,
  deleteOne,
} = require("../controllers/productControllers");

router.post("/create", upload.array("files", 10), create);
router.put("/update/:id", upload.array("files", 10), update);
router.get("/", getAll);
router.get("/:id", getOne);
router.delete("/:id", deleteOne);

module.exports = router;
