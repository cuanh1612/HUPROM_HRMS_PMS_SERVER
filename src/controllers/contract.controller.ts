import { Request, Response } from 'express'
import { sign, verify } from 'jsonwebtoken'
import { getManager } from 'typeorm'
import { Client } from '../entities/Client.entity'
import { Company_logo } from '../entities/Company_Logo.entity'
import { Contract } from '../entities/Contract.entity'
import { Contract_type } from '../entities/Contract_Type.entity'
import { Notification } from '../entities/Notification.entity'
import { createOrUpdateContractPayload } from '../type/ContractPayload'
import handleCatchError from '../utils/catchAsyncError'
import { contractValid } from '../utils/valid/contractValid'

const contractController = {
	getAll: handleCatchError(async (_: Request, res: Response) => {
		const contracts = await Contract.find() 
		
		return res.status(200).json({
			code: 200,
			success: true,
			contracts,
			message: 'Get all contracts successfully',
		})
	}),

	getAllByClient: handleCatchError(async (req: Request, res: Response) => {
		const {clientId} = req.params;

		//Check existing client 
		const existingClient = await Client.findOne({
			where: {
				id: Number(clientId)
			}
		})

		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Not found client to get contracts',
			})

		const contracts = await Contract.find({
			where: {
				client: {
					id: existingClient.id
				}
			}
		})
		
		return res.status(200).json({
			code: 200,
			success: true,
			contracts,
			message: 'Get all contracts successfully',
		})
	}),

	getDetail: handleCatchError(async (req: Request, res: Response) => {
		const { contractId } = req.params

		//Check existing contract
		const existingContract = await Contract.findOne({
			where: {
				id: Number(contractId),
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

		return res.status(200).json({
			code: 200,
			success: true,
			contract: existingContract,
			message: 'Get detail contract successfully',
		})
	}),

	publicLink: handleCatchError(async (req: Request, res: Response) => {
		const { idContract } = req.body
		if (!idContract) {
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract not exist',
			})
		}
		const contract = await Contract.findOne({
			where: {
				id: Number(idContract),
			},
		})

		if (!contract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exists in the system',
			})

		const token = sign(
			{
				id: idContract,
			},
			`${process.env.CONTRACT_TOKEN_SECRET}`,
			{
				expiresIn: '10m',
			}
		)

		return res.status(200).json({
			code: 200,
			success: true,
			token,
			message: 'Created contract link successfully',
		})
	}),

	public: handleCatchError(async (req: Request, res: Response) => {
		const { token } = req.params

		try {
			const { id } = verify(token, `${process.env.CONTRACT_TOKEN_SECRET}`) as {
				id: string | number
			}
			const contract = await Contract.findOne({
				where: {
					id: Number(id),
				},
			})

			if (!contract)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Contract does not exists in the system',
				})

			return res.status(200).json({
				code: 200,
				success: true,
				contract,
				message: 'Created contract token successfully',
			})
		} catch (error) {
			return res.status(403).json({
				code: 403,
				success: false,
				message: 'You not allow to see',
			})
		}
	}),

	create: handleCatchError(async (req: Request, res: Response) => {
		const dataNewContract: createOrUpdateContractPayload = req.body

		//Check valid
		const messageValid = contractValid.createOrUpdate(dataNewContract)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing client
		const existingClient = await Client.findOne({
			where: {
				id: dataNewContract.client,
			},
		})

		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Client does not exists in the system',
			})

		//Check exist contract type
		if (dataNewContract.contract_type) {
			const existingContractType = await Contract_type.findOne({
				where: {
					id: dataNewContract.contract_type,
				},
			})

			if (!existingContractType)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Contract type does not exists in the system',
				})
		}

		//Create new contract
		const newContract = await Contract.create({
			...dataNewContract,
		}).save()

		//create new note for client
		await Notification.create({
			client: existingClient,
			url: '/contracts',
			content: 'There is a new contract you have just been assigned',
		}).save()

		return res.status(200).json({
			code: 200,
			success: true,
			contract: newContract,
			message: 'Created new contract successfully',
		})
	}),

	importCSV: handleCatchError(async (req: Request, res: Response) => {
		const { contracts }: { contracts: createOrUpdateContractPayload[] } = req.body

		const contractNotValid: number[] = []

		//contract not have client or client category
		const contractNotCLCA: number[] = []

		await Promise.all(
			contracts.map((contract) => {
				return new Promise(async (resolve) => {
					//Check valid
					const messageValid = contractValid.createOrUpdate(contract)

					if (messageValid && contract.index) {
						contractNotValid.push(contract.index)
					} else {
						//Check existing client
						const existingClient = await Client.findOne({
							where: {
								id: contract.client,
							},
						})

						const existingContractType = await Contract_type.findOne({
							where: {
								id: contract.contract_type,
							},
						})

						if (!existingClient || !existingContractType) {
							if (contract.index) contractNotCLCA.push(contract.index)
						} else {
							//Create new contract
							await Contract.create({
								...contract,
								subject: contract.subject,
							}).save()

							//create new note for client
							await Notification.create({
								client: existingClient,
								url: '/contracts',
								content: 'There is a new contract you have just been assigned',
							}).save()
						}
					}

					resolve(true)
				})
			})
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: `Create contracts by import csv successfully${contractNotValid.length > 0
					? `. Incorrect lines of data that are not added to the server include index ${contractNotValid.toString()}`
					: ''
				}${contractNotCLCA.length > 0
					? `. Contract data not existing client or client category include index ${contractNotCLCA.toString()}`
					: ``
				}`,
		})
	}),

	update: handleCatchError(async (req: Request, res: Response) => {
		const dataUpdateContract: createOrUpdateContractPayload = req.body
		const { contractId } = req.params

		//Check valid
		const messageValid = contractValid.createOrUpdate(dataUpdateContract)

		if (messageValid)
			return res.status(400).json({
				code: 400,
				success: false,
				message: messageValid,
			})

		//Check existing contract
		const existingContract = await Contract.findOne({
			where: {
				id: Number(contractId),
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

		//Check exist contract type
		if (dataUpdateContract.contract_type) {
			const existingContractType = await Contract_type.findOne({
				where: {
					id: dataUpdateContract.contract_type.id,
				},
			})

			if (!existingContractType)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Contract does not exists in the system',
				})
		}

		if (dataUpdateContract.client) {
			//Check existing client
			const existingClient = await Client.findOne({
				where: {
					id: dataUpdateContract.client,
				},
			})

			if (!existingClient)
				return res.status(400).json({
					code: 400,
					success: false,
					message: 'Client does not exist in the system',
				})
		}

		//Check exist and update company avatar
		const { company_logo, ...dataUpdateContractBase } = dataUpdateContract
		let newCompanyLogo: Company_logo | null = null

		if (company_logo) {
			if (existingContract.company_logo) {
				const existingCompanyLogo = await Company_logo.findOne({
					where: {
						id: existingContract.company_logo.id,
					},
				})

				if (existingCompanyLogo) {
					await Company_logo.update(existingCompanyLogo.id, {
						...company_logo,
					})
				}
			} else {
				newCompanyLogo = await Company_logo.create({
					...company_logo,
				}).save()
			}
		}

		//Update contract
		await Contract.update(
			{
				id: existingContract.id,
			},
			{
				...dataUpdateContractBase,
				...(newCompanyLogo
					? {
						company_logo: newCompanyLogo,
					}
					: {}),
			}
		)

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Updated contract successfully',
		})
	}),

	delete: handleCatchError(async (req: Request, res: Response) => {
		const { contractId } = req.params

		//Check existing contract
		const existingContract = await Contract.findOne({
			where: {
				id: Number(contractId),
			},
		})

		if (!existingContract)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Contract does not exist in the system',
			})

		//Delete contract
		await existingContract.remove()

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Delete contract successfully',
		})
	}),

	deleteMany: handleCatchError(async (req: Request, res: Response) => {
		const { contracts } = req.body
		if (!contracts || !Array.isArray(contracts))
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Please select many contracts to delete',
			})

		for (let index = 0; index < contracts.length; index++) {
			const contractId = contracts[index]

			//Check existing contract
			const existingContract = await Contract.findOne({
				where: {
					id: Number(contractId),
				},
			})

			if (existingContract) {
				//Delete contract
				await existingContract.remove()
			}
		}

		return res.status(200).json({
			code: 200,
			success: true,
			message: 'Deleted all contracts successfully',
		})
	}),

	countContractSignedEmployee: handleCatchError(async (req: Request, res: Response) => {
		const { clientId } = req.params

		//Check existing client
		const existingClient = await Client.findOne({
			where: {
				id: Number(clientId),
			},
		})

		if (!existingClient)
			return res.status(400).json({
				code: 400,
				success: false,
				message: 'Not Found Client',
			})

		//Get count contrat signed 
		const countContractSigned = await getManager('huprom').query(
			`SELECT COUNT("public"."contract"."id") FROM "public"."contract" LEFT JOIN "public"."client" ON "public"."contract"."clientId" = "public"."client"."id" WHERE "public"."contract"."signId" IS NOT NULL AND "public"."client"."id" = ${existingClient.id}`
		)

		return res.status(200).json({
			code: 200,
			success: true,
			countStatusProjects: Number(countContractSigned[0].count) || 0,
			message: 'Get count contract assigned successfully',
		})
	}),
}

export default contractController
