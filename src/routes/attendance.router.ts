import express from 'express'
import attendanceController from '../controllers/attendance.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const attendanceRouter = express.Router()

attendanceRouter.get('/', attendanceController.getAll)

attendanceRouter.post('/',  checkAuth(['Admin']), attendanceController.insertOne)

attendanceRouter.put('/:id', checkAuth(['Admin']), attendanceController.update)

attendanceRouter.get('/:id', attendanceController.getDetail)

attendanceRouter.delete('/:id', checkAuth(['Admin']), attendanceController.delete)

export default attendanceRouter
