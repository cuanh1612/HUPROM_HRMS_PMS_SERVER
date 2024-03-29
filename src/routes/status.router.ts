import express from "express";
import statusController from "../controllers/status.controller";
import { checkAuth } from "../utils/middleware/checkAuth";

 //Check auth in controller
 const statusRouter = express.Router()

 statusRouter.post('/', checkAuth([]), statusController.create)
 
 statusRouter.get('/normal/:projectId', statusController.getAllPj)
 statusRouter.get('/detail/:id', statusController.getDetail)
 statusRouter.get('/:projectId', statusController.getAllWithTask)

 
 statusRouter.put('/position', checkAuth([]), statusController.changePosition)
 statusRouter.put('/:id', checkAuth([]), statusController.update)

 statusRouter.delete('/:id', checkAuth([]), statusController.delete)


 export default statusRouter