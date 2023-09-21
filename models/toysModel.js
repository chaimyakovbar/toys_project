const mongoose = require("mongoose")
const joi = require("joi")

const toyShcema = new mongoose.Schema({
  name: String,
  info: String,
  category: String,
  img_url: String,
  price:Number,
  date_created:Date,
  user_id:String
});

const ToyModel = mongoose.model("toys", toyShcema);
exports.ToyModel = ToyModel;

exports.toyValid = (chaim) => {
  const joiSchima = joi.object({
    name: joi.string().min(2).max(999).required(),
    info: joi.string().min(2).max(999).required(),
    category: joi.string().min(2).max(999).required(),
    img_url: joi.string().min(2).max(999).required(),
    price: joi.number().min(2).max(999).required(),
    date_created: joi.date().min(2).max(999).required(),
    user_id: joi.string().min(2).max(999).required(),
  });
  return joiSchima.validate(chaim);
};

