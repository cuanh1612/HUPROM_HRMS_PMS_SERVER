import handleCatchError from '../utils/catchAsyncError'
import { Request, Response } from 'express'
import { jobApplicationValid } from '../utils/valid/jobApplicationValid'
import { Job } from '../entities/Job.entity'
import { Location } from '../entities/Location.entity'
import { Job_Application } from '../entities/Job_Application.entity'
import { createOrUpdateJobApplicationPayload } from '../type/JobApplicationPayload'
import { Job_application_picture } from '../entities/Job_Application_Picture.entity'
import { Skill } from '../entities/Skill.entity'
import { Job_application_file } from '../entities/Job_Application_File.entity'

const jobApplicationController = {
	updateStatus: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const { status } = req.body
		if (!id) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please enter full field',
			})
		}
		const existingJob = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingJob) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application not exist in system',
			})
		}

		existingJob.status = status
		await existingJob.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update status successfully ',
		})
	}),
	//create new job application
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewJobApplication: createOrUpdateJobApplicationPayload = req.body
		const { jobs, location, files } = dataNewJobApplication

		const messageValid = jobApplicationValid.createOrUpdate(dataNewJobApplication)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				succesS: false,
				message: messageValid,
			})

		//check exist jobs
		const existingJobs = await Job.findOne({
			where: {
				id: jobs,
			},
		})
		if (!existingJobs)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not existing in the system',
			})
		//check exist location
		const existingLocation = await Location.findOne({
			where: {
				id: location,
			},
		})
		if (!existingLocation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Location does not existing in the system',
			})
		
		// Create job application
		const createJobApplication = await Job_Application.create({
			...dataNewJobApplication,
		}).save()

		// Create files for job application
		if (files && Array.isArray(files)) {
			files.map(async (file) => {
				await Job_application_file.create({
					...file,
					job_application: createJobApplication,
				}).save()
			})
		}

		return res.status(200).json({
			code: 200,
			success: true,
			job_application: createJobApplication,
			message: ' Create job application',
		})
	}),
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateJobApplication: createOrUpdateJobApplicationPayload = req.body
		const { location, jobs } = dataUpdateJobApplication

		//check exist job application
		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job Application does not exist in the system',
			})

		//check exist jobs
		const existingJobs = await Job.findOne({
			where: {
				id: jobs,
			},
		})
		if (!existingJobs)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Job does not existing in the system',
			})
		//check exist location
		const existingLocation = await Location.findOne({
			where: {
				id: location,
			},
		})
		if (!existingLocation)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Location does not existing in the system',
			})
		

		//Delete old picture
		const oldPictureId = existingJobApplication?.picture?.id || undefined

		;(existingJobApplication.name = dataUpdateJobApplication.name),
			(existingJobApplication.email = dataUpdateJobApplication.email),
			(existingJobApplication.jobs = dataUpdateJobApplication.jobs),
			(existingJobApplication.location = dataUpdateJobApplication.location),
			(existingJobApplication.mobile = dataUpdateJobApplication.mobile),
			(existingJobApplication.picture = dataUpdateJobApplication.picture),
			(existingJobApplication.cover_leter = dataUpdateJobApplication.cover_leter),
			(existingJobApplication.status = dataUpdateJobApplication.status),
			(existingJobApplication.source = dataUpdateJobApplication.source)

		await existingJobApplication.save()
		

		if (dataUpdateJobApplication.picture && oldPictureId) {
			const existingJobApplicationPicture = await Job_application_picture.findOne({
				where: {
					id: oldPictureId,
				},
			})

			if (existingJobApplicationPicture) {
				await existingJobApplicationPicture.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update job application success',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
			relations: {
				jobs: true,
				location: true,
			},
		})
		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			jobApplication: existingJobApplication,
			message: 'Get detail of job application success',
		})
	}),

	getAll: handleCatchError(async (_, res: Response) => {
		const jobApplications = await Job_Application.find({
			relations: {
				location: true,
				jobs: true,
			},
		})

		return res.status(200).json({
			code: 200,
			success: true,
			jobApplications,
			message: 'Get all job application success',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingJobApplication = await Job_Application.findOne({
			where: {
				id: Number(id),
			},
		})
		if (!existingJobApplication)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'This job application does not exist in the system',
			})

		//Delete picture job application
		const pictureId = existingJobApplication?.picture?.id || undefined

		//Delete job application
		await existingJobApplication.remove()

		if (pictureId) {
			const existingJobApplicationPicture = await Job_application_picture.findOne({
				where: {
					id: pictureId,
				},
			})

			if (existingJobApplicationPicture) {
				await existingJobApplicationPicture.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'delete job application success',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { jobApplications } = req.body
	
		//check array of job applications
		if (!Array.isArray(jobApplications))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'job application does not existing in the system',
			})

		await Promise.all(
			jobApplications.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingJobApplication = await Job_Application.findOne({
						where: {
							id: id,
						},
					})
					if (existingJobApplication) {
						//Delete picture job application
						const pictureId = existingJobApplication.picture? existingJobApplication.picture.id : undefined

						//Delete job application
						await Job_Application.remove(existingJobApplication)

						if (pictureId) {
							const existingJobApplicationpicture =
								await Job_application_picture.findOne({
									where: {
										id: pictureId,
									},
								})

							if (existingJobApplicationpicture) {
								await existingJobApplicationpicture.remove()
							}
						}
					}
					resolve(true)
				})
			})
		)
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete job applications success',
		})
	}),

	changeStatusMany: handleCatchError(async (req: Request, res: Response) => {
		const { job_applications } = req.body
		const { status } = req.body

		//check array of job applications
		if (!Array.isArray(job_applications || job_applications))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'job application does not existing in the system',
			})

		await Promise.all(
			job_applications.map(async (id: number) => {
				return new Promise(async (resolve) => {
					const existingJobApplication = await Job_Application.findOne({
						where: {
							id: id,
						},
					})
					if (existingJobApplication) {
						existingJobApplication.status = status
					}
					await existingJobApplication?.save()
					resolve(true)
				})
			})
		)
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'change status job applications success',
		})
	}),

	changeSkills: handleCatchError(async (req: Request, res: Response) => {
		const { skills, jobApplicationId } = req.body
		let listValidSkill: Skill[] = []

		//Check existiong joapplication
		const existingApplication = await Job_Application.findOne({
			where: {
				id: jobApplicationId
			}
		})

		if(!existingApplication) return res.status(400).json({
			code: 400,
			success: false,
			message: 'Existing Application does not exist in the system',
		})

		if (!Array.isArray(skills) || skills.length === 0)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select skills for this job application',
			})

		await Promise.all(
			skills.map((skillId: number) => {
				return new Promise(async (resolve) => {
					//Check existing skill
					const existingSkill = await Skill.findOne({
						where: {
							id: skillId,
						},
					})

					if (existingSkill) {
						listValidSkill.push(existingSkill)
					}
					return resolve(true)
				})
			})
		)

		//Update skill
		if(listValidSkill.length > 0){
			existingApplication.skills = listValidSkill
			await existingApplication.save()
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Change skills for job application success',
		})
	}),

    getByJob: handleCatchError(async(req: Request, res: Response) =>{
        const {JobId} = req.params

        const existingJob = await Job.findOne({
            where:{
                id: Number(JobId)
            },
        })

        if(!existingJob)
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Job does not existing in the system'
        })

        const jobApplicationsByJob = await Job_Application.find({
            where:{
                jobs: {
                    id: Number(JobId)
                }
            },
			relations: {
				location: true,
				jobs: true,
				skills: true
			},
        })

         if(!jobApplicationsByJob)
         return res.status(400).json({
            code: 400,
            success: false,
            message: 'Job application does not existing in the system'
        })

        return res.status(200).json({
            code: 200,
            success: true,
            jobApplications: jobApplicationsByJob,
            message: 'Get job application by job success'
        })

    })
}

export default jobApplicationController
