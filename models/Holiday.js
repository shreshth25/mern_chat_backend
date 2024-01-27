const { default: mongoose } = require("mongoose");

const holidaySchema = new mongoose.Schema({
    name: {type: String, require: true},
    date: {type: Date, require: true}
}, {timestamps: true})


const Holiday = mongoose.model('Holiday', holidaySchema)

module.exports = Holiday