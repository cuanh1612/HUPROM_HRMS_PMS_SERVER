import express from 'express'
import holidayController from '../controllers/holiday.controller'
import { checkAuth } from '../utils/middleware/checkAuth'


const holidayRouter = express.Router()

holidayRouter.post('/', checkAuth(['Admin']), holidayController.create)


holidayRouter.put('/:id', checkAuth(['Admin']), holidayController.update)

holidayRouter.get('/', holidayController.getAll)
holidayRouter.get('/:id', holidayController.getDetail)

holidayRouter.delete('/:id', checkAuth(['Admin']), holidayController.delete)
holidayRouter.post('/delete-many', checkAuth(['Admin']), holidayController.deleteMany)

export default holidayRouter