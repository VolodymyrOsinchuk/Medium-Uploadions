const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const productModel = require("../models/productModel");
const cloudinary = require("../config/cloudinary");

const create = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;

  const uploader = async (path) => await cloudinary.uploads(path, "uploads");

  try {
    if (req.method === "POST") {
      const urls = [];
      if (req.files) {
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newPath = await uploader(path);
          urls.push(newPath);
          fs.unlinkSync(path);
        }
      }

      const productId = uuidv4();

      const product = await productModel.create({
        productId: productId,
        name: name,
        description: description,
        price: price,
        files: urls,
      });

      return res.status(201).json({
        success: true,
        message: "product created sucessfully",
        data: product,
      });
    } else {
      return res.status(405).json({
        err: `${req.method} method not allowed`,
      });
    }
  } catch (error) {
    return res.status(412).json({
      success: false,
      message: error.message,
    });
  }
});

const getAll = asyncHandler(async (req, res) => {
  try {
    const products = await productModel.find().exec();

    if (!products) {
      res.status(404).json({
        success: false,
        message: "Not products!",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(412).json({
      success: false,
      message: error.message,
    });
  }
});

const getOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const product = await productModel.findOne({ productId: id });

    if (product) {
      return res.status(200).json({
        success: true,
        data: product,
      });
    }
  } catch (error) {
    return res.status(412).json({
      success: false,
      message: error.message,
    });
  }
});

const update = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;
  const { id } = req.params;
  let product = await productModel.findOne({ productId: id });
  try {
    if (product) {
      if (req.method === "PUT") {
        const urls = [];
        if (req.files) {
          const files = req.files;
          for (const file of files) {
            const { path } = file;
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
          }
          product.updateOne(
            {
              $set: {
                name: name,
                description: description,
                price: price,
              },
            },
            {},
            { new: true }
          );
          return res.status(200).json({
            success: true,
            message: "product updated sucessfully",
            data: req.body,
          });
        }
      }
    } else {
      return res.status(405).json({
        error: `${req.method} method not allowed`,
      });
    }
  } catch (error) {
    return res.status(412).json({
      success: false,
      message: error.message,
    });
  }
});

const deleteOne = asyncHandler(async (req, res) => {
  const id = req.params.id;
  let product = await productModel.findOne({ productId: id });

  try {
    if (product) {
      await productModel.deleteOne({ productId: id });

      return res.status(200).json({
        success: true,
        message: "Product was succesfully deletad",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "This product not exist",
      });
    }
  } catch (error) {
    return res.status(412).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = {
  create,
  update,
  getAll,
  getOne,
  deleteOne,
};
