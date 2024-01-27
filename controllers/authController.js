const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');


const register = async (req, resp) => {
  const { email, password, firstname, lastname } = req.body;

  if (!email || !password || !firstname) {
    resp
    .status(200)
    .json({ status: "Error", data: "All fields are required" });
    return;
  }

  const existing_user = await User.findOne({ email: email });
  if (existing_user) {
    resp
    .status(200)
    .json({ status: "Error", data: "Email Already exists" });
    return;
  }

  const hashed_password = await bcrypt.hash(password, 10);
  const code = 'MANAZE-'+uuidv4();
  const user = new User({
    firstname,
    lastname,
    email,
    code,
    password: hashed_password,
  });
  await user.save();

  resp
  .status(200)
  .json({ status: "Success", data: "Account created succesfully" });
};

const login = async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    resp
    .status(200)
    .json({ status: "Error", data: "All fields are required" });
    return;
  }

  const existing_user = await User.findOne({ email: email });
  if (!existing_user) {
    resp
    .status(200)
    .json({
      status: "Error",
      message: "No account accociated with this email",
    });
    return;
  }
  const isMatch = await bcrypt.compare(password, existing_user.password);
  if (!isMatch) {
    resp
    .status(200)
    .json({ status: "Error", message: "Invalid Credentials" });
    return;
  }
  token = jwt.sign({ user_id: existing_user.id }, process.env.SECRET_KEY);
  resp
  .status(200)
  .json({ status: "Success", message: "Login Successfully", token, user: existing_user });
};

const profile = async (req, resp)=>{
    const user = await User.findById(req.user.user_id)
    resp
    .status(200)
    .json({"message":"Profile", user: user})
}

const updateProfile = async (req, resp) => {
  const { firstname, lastname, dob, years_of_experience, fathers_name, mothers_name, joining_date, age } = req.body;


  const existing_user = await User.findById(req.user.user_id);
  Object.assign(existing_user, {
    firstname,
    lastname,
    dob,
    years_of_experience,
    fathers_name,
    mothers_name,
    joining_date,
    age,
  });

  await existing_user.save();

  resp
  .status(200)
  .json({ status: "Success", message: "Account updated succesfully" });
};

const updateImage = async (req, resp) => {
  const user = await User.findById(req.user.user_id)
  user.image = req.file.path
  await user.save()
  resp
  .status(200)
  .json({ status: "Success", message: "Image Uploaded succesfully" });
};

module.exports = {
  register,
  login,
  profile,
  updateProfile,
  updateImage
};
