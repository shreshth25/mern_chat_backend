const User = require("../models/User")

const getUsers = async (res, resp)=>{
    const data = await User.find({})
    resp.json({data:data})
}

module.exports = {
    getUsers
}