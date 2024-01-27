const express = require('express')
const { addHoliday, getHoliday, updateHoliday } = require('../controllers/holidayController')

const holidayRouter = express()

holidayRouter.get('', getHoliday)
holidayRouter.post('/add', addHoliday)
holidayRouter.post('/update', updateHoliday)

module.exports = holidayRouter