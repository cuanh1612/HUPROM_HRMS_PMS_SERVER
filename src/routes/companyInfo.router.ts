import express from 'express'
import companyInfoController from '../controllers/companyInfo.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const companyInfoRouter = express.Router()

companyInfoRouter.put('/', checkAuth(['Admin']), companyInfoController.update)

companyInfoRouter.get('/', companyInfoController.getInfo)

export default companyInfoRouter
