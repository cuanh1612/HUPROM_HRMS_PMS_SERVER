import { Request, Response } from 'express'
import { Job_Type } from "../entities/Job_Type"
import handleCatchError from "../utils/catchAsyncError"




const jobTypeController = {
    create: handleCatchError(async (req: Request, res: Response) =>{
        const { name } = req.body

        if(!name){
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            })
        }

        const add_result = await Job_Type.create({
            name: name
        }).save()

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create job type success',
            result: add_result,
        })
    }),

   

    getAll: handleCatchError(async (_: Request, res: Response) =>{
            const job_types = await Job_Type.find()

            return res.status(200).json({
                code: 200,
                success: true,
                job_types,
                message: 'get all job types success'
            })
    }),

    update: handleCatchError(async ( req: Request, res: Response) => {
        const {id} = req.params
        const dataUpdateJobType = req.body
        
        const existingjobtype = await Job_Type.findOne({
            where: {
                id: Number(id),
            }
        })

        if(!existingjobtype)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'job type does not existing in the system',
            })
        
        ;(existingjobtype.name = dataUpdateJobType.name),

        await existingjobtype.save()

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update job type success',
		})
        
    }),

    getdetail: handleCatchError(async (req: Request,  res: Response) =>{
        const {id} = req.params

        const existingjobtype = await Job_Type.findOne({
            where: {
                id: Number(id)
            }
        })

        if(!existingjobtype)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job type does not existing in the system',
            })
        
        return res.status(200).json({
            code: 200,
            success: true,
            skill: existingjobtype,
            message: 'Get detail of job type success'
        })
    }),

    delete: handleCatchError(async (req: Request, res: Response) =>{
        const {id} = req.params

        const existingjobtype = await Job_Type.findOne({
            where: {
                id: Number(id),
            }
        })

        if(!existingjobtype)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job type does not existing in the system',
            })
    
        await existingjobtype.remove()

        return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete job type success',
		})
    }),

    
}

export default jobTypeController