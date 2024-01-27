const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {type: String, require: true},
    lastname: {type: String, require: true},
    dob: {type: Date},
    role: {type: String,enum: ['employee', 'admin', 'staff'], default: 'employee'},
    code: {type: String},
    age: {type: Number},
    fathers_name: {type: String},
    mothers_name: {type: String},
    joining_date: {type: String},
    years_of_experience: {type: Number},
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    image: {type: String},
}, {timestamps:true})


const User = mongoose.model('User', userSchema)

module.exports = User