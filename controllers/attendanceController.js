const Attendance = require("../models/Attendance")

const addAttendance = async(req, resp)=>{
    const {date, comment, hours} = req.body
    var varDate = new Date(date);
    var today = new Date();
    if(varDate>today)
    {
        return resp.json({'status':"Error", 'message':"Can't add future attendance"})
    }

    const already_exist = await Attendance.findOne({user:req.user.user_id, date: date})
    if(already_exist)
    {
        return resp.json({'status':"Error", 'message':'Attendance already added for same date'})
    }
    const attendance = new Attendance({
        date,
        comment,
        hours,
        user: req.user.user_id
    })

    await attendance.save()
    resp.json({'status':"Success", 'message':'Attendance Added'})
}

const getAttendance = async(req, resp)=>{
    const attendance = await Attendance.find({user: req.user.user_id}).sort('-date')
    resp.json({data:attendance})
}
module.exports = {
    addAttendance,
    getAttendance
}