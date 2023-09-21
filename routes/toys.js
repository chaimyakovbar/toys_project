const express = require("express");
const { ToyModel, toyValid } = require("../models/toysModel");
const { auth } = require("../middleware/auth");
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;
    let filterFind = {};
    if (req.query.s) {
      const search = new RegExp(req.query.s, "i");
      filterFind = { $or: [{ name: search }, { info: search }] };
    }
    const data = await ToyModel.find(filterFind)
      .limit(limit)
      .skip(limit * page)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/category", async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const cat = req.query.cat;
    const data = await ToyModel.find({ category: cat }).limit(limit);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.get("/prices", async (req, res) => {
  try {
    const min = req.query.min || 0;
    const max = req.query.max || Infinity;
    const limit = req.query.limit || 10;
    const data = await ToyModel.find({
      price: { $gte: min, $lte: max },
    }).limit(limit);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ToyModel.findOne({ _id: id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.get("/count", async (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const data = await ToyModel.countDocuments({});
    res.json({ data, pages: Math.ceil(data / limit) });
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.post("/", auth, async (req, res) => {
  const validBody = toyValid(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const product = new ToyModel(req.body);
    product.user_id = req.tokenData._id;
    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.put("/:id", auth, async (req, res) => {
  const validBody = toyValid(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const id = req.params.id;
    const data = await ToyModel.updateOne(
      { _id: id, user_id: req.tokenData._id },
      req.body
    );
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ToyModel.deleteOne({
      _id: id,
      user_id: req.tokenData._id,
    });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
module.exports = router;
