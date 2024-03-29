"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const argon2_1 = __importDefault(require("argon2"));
const typeorm_1 = require("typeorm");
const Avatar_entity_1 = require("../entities/Avatar.entity");
const Client_entity_1 = require("../entities/Client.entity");
const Client_Category_entity_1 = require("../entities/Client_Category.entity");
const Client_Sub_Category_entity_1 = require("../entities/Client_Sub_Category.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const Project_entity_1 = require("../entities/Project.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const clientValid_1 = require("../utils/valid/clientValid");
const clientController = {
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const clients = yield Client_entity_1.Client.find();
        return res.status(200).json({
            code: 200,
            success: true,
            clients: clients || [],
            message: 'Get all clients successfully',
        });
    })),
    getNormal: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const clients = yield Client_entity_1.Client.find({
            select: {
                id: true,
                name: true,
                email: true,
                avatar: {
                    url: true,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            clients,
            message: 'Get all clients successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            client: existingClient,
            message: 'Get detail client successfully',
        });
    })),
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewClient = req.body;
        //Check valid
        const messageValid = clientValid_1.clientValid.createOrUpdate(dataNewClient, 'create');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing email
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                email: dataNewClient.email,
            },
        });
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                email: dataNewClient.email,
            },
        });
        if (existingEmployee || existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email already exists in the system',
            });
        //Check existing client category
        if (dataNewClient.client_category) {
            const existCategory = yield Client_Category_entity_1.Client_Category.findOne({
                where: {
                    id: dataNewClient.client_category,
                },
            });
            if (!existCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not exist',
                });
        }
        //Check existing client sub category
        if (dataNewClient.client_sub_category) {
            const existSubCategory = yield Client_Sub_Category_entity_1.Client_Sub_Category.findOne({
                where: {
                    id: dataNewClient.client_sub_category,
                },
            });
            if (!existSubCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client sub category does not exist',
                });
            //Check parent category of sub category is match with input category
            if (existSubCategory.client_category.id !== Number(dataNewClient.client_category))
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not match with the parent of sub-category',
                });
        }
        const hashPassword = yield argon2_1.default.hash(dataNewClient.password);
        //Create new client
        const newClient = Client_entity_1.Client.create(Object.assign(Object.assign({}, dataNewClient), { password: hashPassword, client_category: dataNewClient.client_category
                ? dataNewClient.client_category
                : undefined, client_sub_category: dataNewClient.client_sub_category
                ? dataNewClient.client_sub_category
                : undefined, salutation: dataNewClient.salutation ? dataNewClient.salutation : undefined }));
        const createdClient = yield newClient.save();
        return res.status(200).json({
            code: 200,
            success: true,
            client: createdClient,
            message: 'Created new client successfully',
        });
    })),
    importCSV: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clients } = req.body;
        const clientsNotValid = [];
        const clientsExistingEmail = [];
        yield Promise.all(clients.map((client) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check valid
                const messageValid = clientValid_1.clientValid.createOrUpdate(client, 'create');
                if (messageValid && client.index) {
                    clientsNotValid.push(client.index);
                }
                else {
                    //Check existing email
                    const existingEmployee = yield Employee_entity_1.Employee.findOne({
                        where: {
                            email: client.email,
                        },
                    });
                    const existingClient = yield Client_entity_1.Client.findOne({
                        where: {
                            email: client.email,
                        },
                    });
                    if ((existingEmployee || existingClient) && client.index) {
                        clientsExistingEmail.push(client.index);
                    }
                    else {
                        const hashPassword = yield argon2_1.default.hash(client.password);
                        //Create new client
                        yield Client_entity_1.Client.create(Object.assign(Object.assign({}, client), { password: hashPassword, can_login: true, can_receive_email: true })).save();
                    }
                }
                resolve(true);
            }));
        }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: `Create clients by import csv successfully${clientsNotValid.length > 0
                ? `. Incorrect lines of data that are not added to the server include index ${clientsNotValid.toString()}`
                : ''}${clientsExistingEmail.length > 0
                ? `. Clients whose email already existing email in the system include index ${clientsExistingEmail.toString()}`
                : ``}`,
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataUpdateClient = req.body;
        const { clientId } = req.params;
        //Check valid
        const messageValid = clientValid_1.clientValid.createOrUpdate(dataUpdateClient, 'update');
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Check root
        if (existingClient.root === true)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Can not edit account root',
            });
        //Check existing email
        const existingEmployeeEmail = yield Employee_entity_1.Employee.findOne({
            where: {
                email: dataUpdateClient.email,
            },
        });
        const existingClientEmail = yield Client_entity_1.Client.findOne({
            where: {
                email: dataUpdateClient.email,
            },
        });
        if (existingEmployeeEmail ||
            (existingClientEmail && existingClientEmail.email !== existingClient.email)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Email already exist in the system',
            });
        }
        //Check existing client category
        if (dataUpdateClient.client_category) {
            const existCategory = yield Client_Category_entity_1.Client_Category.findOne({
                where: {
                    id: dataUpdateClient.client_category,
                },
            });
            if (!existCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not exist',
                });
        }
        //Check existing client sub category
        if (dataUpdateClient.client_sub_category) {
            const existSubCategory = yield Client_Sub_Category_entity_1.Client_Sub_Category.findOne({
                where: {
                    id: dataUpdateClient.client_sub_category,
                },
            });
            if (!existSubCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client sub category does not exist',
                });
            //Check parent category of sub category is match with input category
            if (existSubCategory.client_category.id !== Number(dataUpdateClient.client_category))
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client category does not match with the parent of sub-category',
                });
        }
        //Check exist and update avatar
        const { avatar } = dataUpdateClient, dataUpdateClientBase = __rest(dataUpdateClient, ["avatar"]);
        let newAvatar = null;
        if (avatar) {
            if (existingClient.avatar) {
                const existingAvatar = yield Avatar_entity_1.Avatar.findOne({
                    where: {
                        id: existingClient.avatar.id,
                    },
                });
                if (existingAvatar) {
                    yield Avatar_entity_1.Avatar.update(existingAvatar.id, Object.assign({}, avatar));
                }
            }
            else {
                newAvatar = yield Avatar_entity_1.Avatar.create(Object.assign({}, avatar)).save();
            }
        }
        const hashPassword = dataUpdateClient.password
            ? yield argon2_1.default.hash(dataUpdateClient.password)
            : null;
        //Update client
        yield Client_entity_1.Client.update({
            id: existingClient.id,
        }, Object.assign(Object.assign(Object.assign(Object.assign({}, dataUpdateClientBase), (hashPassword ? { password: hashPassword } : {})), (newAvatar
            ? {
                avatar: newAvatar,
            }
            : {})), { client_category: dataUpdateClient.client_category
                ? dataUpdateClient.client_category
                : undefined, client_sub_category: dataUpdateClient.client_sub_category
                ? dataUpdateClient.client_sub_category
                : undefined, salutation: dataUpdateClient.salutation ? dataUpdateClient.salutation : undefined }));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated client successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check existing client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Check root
        if (existingClient.root === true)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Can not delete account root',
            });
        //Delete client
        yield existingClient.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete client successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clients } = req.body;
        if (!clients)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select many clients to delete',
            });
        for (let index = 0; index < clients.length; index++) {
            const clientId = clients[index];
            //Check existing client
            const existingClient = yield Client_entity_1.Client.findOne({
                where: {
                    id: Number(clientId),
                },
            });
            if (existingClient && existingClient.root === false) {
                //Delete client
                yield existingClient.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted all clients successfully',
        });
    })),
    totalProjects: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check exist client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Get total projects by client
        const totalProjects = yield Project_entity_1.Project.createQueryBuilder('project')
            .where('project.client = :clientId', { clientId })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalProjects,
            message: 'Get total projects successfully',
        });
    })),
    totalEarnings: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check exist client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Get total earning
        const totalEarnings = yield (0, typeorm_1.getManager)('huprom').query(`SELECT SUM(time_log.earnings) FROM time_log LEFT JOIN project on time_log."projectId" = project.id WHERE project."clientId" = ${clientId}`);
        return res.status(200).json({
            code: 200,
            success: true,
            totalEarnings: Number(totalEarnings[0].sum) || 0,
            message: 'Get total earnings successfully',
        });
    })),
    statusProjects: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check exist client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Get status project
        const statusProjects = yield (0, typeorm_1.getManager)('huprom').query(`SELECT project.project_status, COUNT(project.id) FROM project WHERE project."clientId" = ${clientId} GROUP BY project.project_status`);
        return res.status(200).json({
            code: 200,
            success: true,
            statusProjects,
            message: 'Get status Projects successfully',
        });
    })),
    pendingMilestone: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check exist client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Get pending milestones
        const pendingMilestone = yield (0, typeorm_1.getManager)('huprom').query(`SELECT * FROM  "milestone" LEFT JOIN "project" ON "milestone"."projectId" = "project"."id" WHERE "milestone"."status" IS FALSE AND "project"."clientId" = ${existingClient.id}`);
        return res.status(200).json({
            code: 200,
            success: true,
            pendingMilestone,
            message: 'Get pending milestones successfully',
        });
    })),
    projects: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { clientId } = req.params;
        //Check exist client
        const existingClient = yield Client_entity_1.Client.findOne({
            where: {
                id: Number(clientId),
            },
        });
        if (!existingClient)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Client does not exist in the system',
            });
        //Get projects
        const projects = yield Project_entity_1.Project.find({
            where: {
                client: {
                    id: existingClient.id,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projects,
            message: 'Get projects successfully',
        });
    })),
};
exports.default = clientController;
