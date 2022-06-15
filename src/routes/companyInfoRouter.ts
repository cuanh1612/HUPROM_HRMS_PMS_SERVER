import express from 'express'
import companyInfoController from '../controllers/companyInfoController'
import { checkAuth } from '../utils/middleware/checkAuth'

const companyInfoRouter = express.Router()

companyInfoRouter.put('/', checkAuth(['Admin']), companyInfoController.update)

companyInfoRouter.get('/', checkAuth([]), companyInfoController.getInfo)

export default companyInfoRouter