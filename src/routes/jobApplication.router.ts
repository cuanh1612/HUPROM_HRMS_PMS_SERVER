import express from 'express'
import jobApplicationController from '../controllers/jobApplication.controller'

const jobApplicationRouter = express.Router()

jobApplicationRouter.post('/', jobApplicationController.create)

jobApplicationRouter.delete('/:id', jobApplicationController.delete)

jobApplicationRouter.post('/delete-many', jobApplicationController.deleteMany)

jobApplicationRouter.get('/', jobApplicationController.getAll)

jobApplicationRouter.get('/:id', jobApplicationController.getDetail)

jobApplicationRouter.get('/job/:JobId', jobApplicationController.getByJob)

jobApplicationRouter.put('/:id', jobApplicationController.update)

jobApplicationRouter.put('/change-status', jobApplicationController.changeStatusMany)

jobApplicationRouter.put('/status/:id', jobApplicationController.updateStatus)

jobApplicationRouter.post('/change-skills', jobApplicationController.changeSkills)

export default jobApplicationRouter
