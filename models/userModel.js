const mongoose = require("mongoose")
const joi = require("joi")
const jwt = require("jsonwebtoken");
require("dotenv").config()

const UserSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const usersModel = mongoose.model("users", UserSchema);
exports.usersModel = usersModel;

exports.creatToken = (user_id,role)=>{
    const token = jwt.sign({_id:user_id,role},process.env.SECRET_CODE,{expiresIn:"600min"})
    return token
}
exports.validateUsers = (reqBody) => {
  const JoiSchema = Joi.object({
    email: Joi.string().min(2).max(99).email().required(),
    password: Joi.string().min(2).max(999).required(),
  });
  return JoiSchema.validate(reqBody);
};
