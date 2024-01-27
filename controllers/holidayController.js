const Holiday = require("../models/Holiday")

const addHoliday = async(req, resp)=>{
    const {name, date} = req.body
    const holiday = new Holiday({
        name,
        date
    })
    await holiday.save()

    resp.json({'success':'Success','message':'Holiday created', holiday})
}


const updateHoliday = async(req, resp)=>{
    const {name, date, id} = req.body
    const holiday = await Holiday.findById(id)
    if(holiday)
    {
        holiday.name = name
        holiday.date = date
        await holiday.save()
    
        resp.json({'success':'Success','message':'Holiday Updated', holiday})
    }
    else
    {
        resp.json({'success':'Error','message':'Not Holiday Updated', holiday})
    }
   
}

const getHoliday = async(req, resp)=>{
    const data =await Holiday.find({})
    resp.json({'success':'Success','message':'Holidays', data})
}

module.exports = {
    addHoliday,
    getHoliday,
    updateHoliday
}