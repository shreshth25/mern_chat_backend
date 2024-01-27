const express = require('express')
const { addAttendance, getAttendance } = require('../controllers/attendanceController')
const { isAuthenticated } = require('../middlewares/authMiddleware')

const attendanceRouter = express()

attendanceRouter.post('/add', isAuthenticated, addAttendance)
attendanceRouter.get('', isAuthenticated, getAttendance)

module.exports = attendanceRouter