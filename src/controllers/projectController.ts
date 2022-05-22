import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Client } from '../entities/Client'
import { Department } from '../entities/Department'
import { Employee, enumRole } from '../entities/Employee'
import { Project } from '../entities/Project'
import { Project_Category } from '../entities/Project_Category'
import { Project_file } from '../entities/Project_File'
import { Status } from '../entities/Status'
import { Task } from '../entities/Task'
import { createOrUpdateProjectPayload } from '../type/ProjectPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { projectValid } from '../utils/valid/projectValid'

const projectController = {
	//Create new project
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewProject: createOrUpdateProjectPayload = req.body
		const { project_category, department, client, employees, Added_by, project_files } =
			dataNewProject
		let projectEmployees: Employee[] = []

		//Check valid input create new project
		//Check valid
		const messageValid = projectValid.createOrUpdate(dataNewProject, 'create')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist Added by
		if (Added_by) {
			const existingAddedBy = await Employee.findOne({
				where: {
					id: Added_by,
				},
			})
			if (!existingAddedBy)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Addmin add this project does not exist in the system',
				})
		}

		//check exist client
		const existingClient = await Client.findOne({
			where: {
				id: client,
			},
		})
		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in the system',
			})

		//check exist department
		const existingDepartment = await Department.findOne({
			where: {
				id: department,
			},
		})
		if (!existingDepartment)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Department does not exist in the system',
			})

		//check exist project categories
		const existingCategories = await Project_Category.findOne({
			where: {
				id: project_category,
			},
		})
		if (!existingCategories)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Category does not exist in the system',
			})

		for (let index = 0; index < employees.length; index++) {
			const employee_id = employees[index]
			const existingEmployee = await Employee.findOne({
				where: {
					id: employee_id,
				},
			})
			if (!existingEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employees does not exist in the system',
				})

			//check role employee
			projectEmployees.push(existingEmployee)
		}

		//create project file
		const createdProject = await Project.create({
			...dataNewProject,
			employees: projectEmployees,
		}).save()
		console.log('ngtientrong1')
		if (project_files) {
			//Create project files
			for (let index = 0; index < project_files.length; index++) {
				const project_file = project_files[index]
				await Project_file.create({
					...project_file,
					project: createdProject,
				}).save()
			}
		}

		const status1 = await Status.create({
			title: 'Incomplete',
			root: true,
			project: createdProject,
			index: 0,
			color: 'red',
		}).save()

		console.log('ngtientrong', status1)

		await Status.create({
			title: 'Complete',
			root: true,
			project: createdProject,
			index: 1,
			color: 'green',
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			project: createdProject,
			message: 'Create new Project successfully',
		})
	}),

	//Update Project
	update: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params
		const dataUpdateProject: createOrUpdateProjectPayload = req.body
		const { Added_by, client, department, project_category } = dataUpdateProject

		const existingproject = await Project.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Check valid input create new project
		//Check valid
		const messageValid = projectValid.createOrUpdate(dataUpdateProject, 'update')

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//check exist Added by
		const existingAddedBy = await Employee.findOne({
			where: {
				id: Added_by,
			},
		})
		if (!existingAddedBy)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Addmin add this project does not exist in the system',
			})

		//check exist client
		const existingClient = await Client.findOne({
			where: {
				id: client,
			},
		})
		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exist in the system',
			})
		//check exist department
		const existingDepartment = await Department.findOne({
			where: {
				id: department,
			},
		})
		if (!existingDepartment)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Department does not exist in the system',
			})
		//check exist project categories
		const existingCategories = await Project_Category.findOne({
			where: {
				id: project_category,
			},
		})
		if (!existingCategories)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Category does not exist in the system',
			})

			//update project
		;(existingproject.name = dataUpdateProject.name),
			(existingproject.project_category = existingCategories),
			(existingproject.department = existingDepartment),
			(existingproject.client = existingClient),
			(existingproject.Added_by = existingAddedBy),
			(existingproject.start_date = dataUpdateProject.start_date),
			(existingproject.deadline = dataUpdateProject.deadline),
			(existingproject.send_task_noti = true)

		await existingproject.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Update Project successfully',
		})
	}),

	//Get all project
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const projects = await Project.find({relations:{
			employees: true,
			client: true,
			
		}})
		return res.status(200).json({
			code: 200,
			success: true,
			projects: projects,
			message: 'Get all projects success',
		})
	}),

	//Get detail project
	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingproject = await Project.findOne({
			relations:{
				client: true,
				employees: true,
			},
			where: {
				id: Number(id),
			},
		})

		if (!existingproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//Calculate percentage of project progress from completed tasks
		const countSuccessTasks = await Task.createQueryBuilder('task')
			.leftJoinAndSelect('status', 'status', 'task.statusId = status.id')
			.where('task.projectId = :id', {
				id: existingproject.id,
			})
			.andWhere('status.title = :title', {
				title: 'Complete',
			})
			.getRawMany()

		console.log(countSuccessTasks)

		// if (countSuccessTasks !== 0 && countTasks !== 0) {
		// 	existingproject.Progress = (countSuccessTasks / countTasks) * 100
		// 	await existingproject.save()
		// }

		return res.status(200).json({
			code: 200,
			success: true,
			project: existingproject,
			message: 'Get detail of project success',
		})
	}),

	//Delete project
	delete: handleCatchError(async (req: Request, res: Response) => {
		const { id } = req.params

		const existingproject = await Project.findOne({
			where: {
				id: Number(id),
			},
		})

		if (!existingproject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		await existingproject.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete project success',
		})
	}),

	deletemany: handleCatchError(async (req: Request, res: Response) => {
		const { projects } = req.body

		//check array of projects
		if (!Array.isArray(projects) || !projects)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})
		for (let index = 0; index < projects.length; index++) {
			const itemProject = projects[index]
			const existingproject = await Project.findOne({
				where: {
					id: itemProject.id,
				},
			})
			if (existingproject) {
				await existingproject.remove()
			}
		}
		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete projects success',
		})
	}),

	//member huy
	checkAssigned: handleCatchError(async (req: Request, res: Response) => {
		const { projectId } = req.params

		//Check exist project
		const existingProject = await Project.findOne({
			where: {
				id: Number(projectId),
			},
		})

		if (!existingProject)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Project does not exist in the system',
			})

		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		//Get data user
		const existingUser =
			(await Employee.findOne({
				where: {
					email: decode.email,
				},
			})) ||
			(await Client.findOne({
				where: {
					email: decode.email,
				},
			}))

		if (!existingUser)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'User does not exist in the system',
			})

		if (
			(existingUser.role === enumRole.EMPLOYEE &&
				existingProject.employees.some(
					(employeeItem) => employeeItem.id === existingUser.id
				)) ||
			existingUser.role === enumRole.ADMIN ||
			(existingUser.role === 'Client' && existingProject.client.email === existingUser.email)
		) {
			return res.status(200).json({
				code: 200,
				success: true,
				message: 'You already signed this project',
			})
		} else {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'You not asigned this project',
			})
		}
	}),
}

export default projectController
