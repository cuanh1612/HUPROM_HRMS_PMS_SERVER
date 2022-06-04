import { Request, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'
import { Like } from 'typeorm'
import { Client } from '../entities/Client'
import { Employee } from '../entities/Employee'
import { Event } from '../entities/Event'
import { createOrUpdateEventPayload } from '../type/EventPayload'
import { UserAuthPayload } from '../type/UserAuthPayload'
import handleCatchError from '../utils/catchAsyncError'
import { eventValid } from '../utils/valid/eventValid'

const eventController = {
	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewEvent: createOrUpdateEventPayload = req.body
		const {
			clientEmails,
			employeeEmails,
			repeatEvery,
			typeRepeat,
			cycles,
			isRepeat,
			starts_on_date,
			ends_on_date,
		} = dataNewEvent
		let eventEmployees: Employee[] = []
		let eventClients: Client[] = []

		//Check valid input create new event
		//Check valid
		const messageValid = eventValid.createOrUpdate(dataNewEvent)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist clients
		for (let index = 0; index < clientEmails.length; index++) {
			const clientEmail = clientEmails[index]

			const existingClient = await Client.findOne({
				where: {
					email: clientEmail,
				},
			})

			if (!existingClient)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client doest not exist in the system',
				})

			eventClients.push(existingClient)
		}

		//Check exist employee
		for (let index = 0; index < employeeEmails.length; index++) {
			const employeeEmail = employeeEmails[index]

			const existEmployee = await Employee.findOne({
				where: {
					email: employeeEmail,
				},
			})

			if (!existEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employee doest not exist in the system',
				})

			eventEmployees.push(existEmployee)
		}

		//Get time start and end event
		const startEventTime = new Date(starts_on_date)
		const endEventTime = new Date(ends_on_date)

		//Repeat event
		if (isRepeat) {
			//Create event
			for (let index = 0; index < cycles; index++) {
				if (index != 0) {
					switch (typeRepeat) {
						case 'Day':
							startEventTime.setDate(startEventTime.getDate() + repeatEvery)
							endEventTime.setDate(endEventTime.getDate() + repeatEvery)
							break

						case 'Week':
							startEventTime.setDate(startEventTime.getDate() + repeatEvery * 7)
							endEventTime.setDate(endEventTime.getDate() + repeatEvery * 7)
							break

						case 'Month':
							startEventTime.setMonth(startEventTime.getDate() + repeatEvery)
							endEventTime.setMonth(endEventTime.getDate() + repeatEvery)
							break

						case 'Year':
							startEventTime.setFullYear(startEventTime.getFullYear() + repeatEvery)
							endEventTime.setFullYear(endEventTime.getFullYear() + repeatEvery)
							break

						default:
							break
					}
				}

				//Create new event
				await Event.create({
					...dataNewEvent,
					clients: [...eventClients],
					employees: [...eventEmployees],
					starts_on_date: new Date(startEventTime.toLocaleDateString()),
					ends_on_date: new Date(endEventTime.toLocaleDateString()),
				}).save()
			}
		} else {
			//Create new event
			await Event.create({
				...dataNewEvent,
				clients: [...eventClients],
				employees: [...eventEmployees],
				starts_on_date: new Date(startEventTime.toLocaleDateString()),
				ends_on_date: new Date(endEventTime.toLocaleDateString()),
			}).save()
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Created new Events successfully',
		})
	}),

	getAll: handleCatchError(async (req: Request, res: Response) => {
		//check exist current user
		const token = req.headers.authorization?.split(' ')[1]

		if (!token)
			return res.status(401).json({
				code: 400,
				success: false,
				message: 'Please login first',
			})

		const decode = verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as UserAuthPayload

		if (!decode)
			return res.status(400).json({
				code: 401,
				success: false,
				message: 'Please login first',
			})

		const { employee, client, name } = req.query
		var filter: {
			name?: any
			employees?: {
				id: number
			}
			clients?: {
				id: number
			}
		} = {}
		if (name) filter.name = Like(String(name))
		if (employee)
			filter.employees = {
				id: Number(employee),
			}

		if (decode.role === 'Employee')
			filter.employees = {
				id: Number(decode.userId),
			}

		if (client)
			filter.clients = {
				id: Number(client),
			}

		if (decode.role === 'Client')
			filter.clients = {
				id: Number(decode.userId),
			}

		const allEvent = await Event.find({
			where: filter,
		})

		return res.status(200).json({
			code: 200,
			success: true,
			Events: allEvent,
			message: 'Get all Events successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		//get id event
		const { enventId } = req.params

		const existingEvent = await Event.findOne({
			where: {
				id: Number(enventId),
			},
		})

		if (!existingEvent)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Event doest not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			event: existingEvent,
			message: 'Get deatail Event successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		//get id event
		const { enventId } = req.params

		const existingEvent = await Event.findOne({
			where: {
				id: Number(enventId),
			},
		})

		if (!existingEvent)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Event doest not exist in the system',
			})

		//Delete event
		existingEvent.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted Event successfully',
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		//get id event
		const { enventId } = req.params

		const dataUpdateEvent: createOrUpdateEventPayload = req.body
		const { clientEmails, employeeEmails } = dataUpdateEvent
		let eventEmployees: Employee[] = []
		let eventClients: Client[] = []

		//Check existing event
		const existingEvent = await Event.findOne({
			where: {
				id: Number(enventId),
			},
		})

		if (!existingEvent)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Event doest not exist in the system',
			})

		//Check valid input update event
		//Check valid
		const messageValid = eventValid.createOrUpdate(dataUpdateEvent)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check exist clients
		for (let index = 0; index < clientEmails.length; index++) {
			const clientsEmail = clientEmails[index]

			const existingClient = await Client.findOne({
				where: {
					email: clientsEmail,
				},
			})

			if (!existingClient)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client doest not exist in the system',
				})

			eventClients.push(existingClient)
		}

		//Check exist employee
		for (let index = 0; index < employeeEmails.length; index++) {
			const employeeEmail = employeeEmails[index]

			const existEmployee = await Employee.findOne({
				where: {
					email: employeeEmail,
				},
			})

			if (!existEmployee)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Employee doest not exist in the system',
				})

			eventEmployees.push(existEmployee)
		}

		//Update event
		existingEvent.clients = eventClients
		;(existingEvent.name = dataUpdateEvent.name),
			(existingEvent.where = dataUpdateEvent.where),
			(existingEvent.color = dataUpdateEvent.color),
			(existingEvent.description = dataUpdateEvent.description),
			(existingEvent.starts_on_date = new Date(
				new Date(dataUpdateEvent.starts_on_date).toLocaleDateString()
			)),
			(existingEvent.starts_on_time = dataUpdateEvent.starts_on_time),
			(existingEvent.ends_on_date = new Date(
				new Date(dataUpdateEvent.ends_on_date).toLocaleDateString()
			)),
			(existingEvent.ends_on_time = dataUpdateEvent.ends_on_time),
			(existingEvent.employees = eventEmployees),
			(existingEvent.clients = eventClients),
			await existingEvent.save()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated Event successfully',
		})
	}),
}

export default eventController
