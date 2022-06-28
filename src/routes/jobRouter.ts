import express from "express";
import jobController from "../controllers/jobController";


const jobRouter = express.Router()


jobRouter.post('/', jobController.create)

jobRouter.delete('/delete-many', jobController.delete)

jobRouter.delete('/delete-many', jobController.deleteMany)


jobRouter.get('/', jobController.getAll)

jobRouter.get('/:id', jobController.getDetail)

jobRouter.put('/:id', jobController.update)

jobRouter.put('/change-status', jobController.changeStatusMany)

export default jobRouter