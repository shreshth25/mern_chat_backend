const { default: mongoose } = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date: {type: Date, require: true},
    comment : {type: String, require: true},
    hours: {type: Number, require: true, default: 0},
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
}, {timestamps: true})

const Attendance = mongoose.model('Attendance', attendanceSchema)

module.exports = Attendance


