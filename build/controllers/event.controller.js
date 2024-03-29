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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const Client_entity_1 = require("../entities/Client.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const Event_entity_1 = require("../entities/Event.entity");
const Notification_entity_1 = require("../entities/Notification.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const eventValid_1 = require("../utils/valid/eventValid");
const eventController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewEvent = req.body;
        const { clientEmails, employeeEmails, repeatEvery, typeRepeat, cycles, isRepeat, starts_on_date, ends_on_date, } = dataNewEvent;
        let eventEmployees = [];
        let eventClients = [];
        //Check valid input create new event
        //Check valid
        const messageValid = eventValid_1.eventValid.createOrUpdate(dataNewEvent);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist clients
        yield Promise.all(clientEmails.map((clientEmail) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingClient = yield Client_entity_1.Client.findOne({
                    where: {
                        email: clientEmail,
                    },
                });
                if (existingClient)
                    eventClients.push(existingClient);
                resolve(true);
            }));
        })));
        //Check exist employee
        yield Promise.all(employeeEmails.map((employeeEmail) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingEmployee = yield Employee_entity_1.Employee.findOne({
                    where: {
                        email: employeeEmail,
                    },
                });
                if (existingEmployee)
                    eventEmployees.push(existingEmployee);
                resolve(true);
            }));
        })));
        //Get time start and end event
        const startEventTime = new Date(starts_on_date);
        const endEventTime = new Date(ends_on_date);
        //Repeat event
        if (isRepeat) {
            //Create event
            for (let index = 0; index < cycles; index++) {
                if (index != 0) {
                    switch (typeRepeat) {
                        case 'Day':
                            startEventTime.setDate(startEventTime.getDate() + repeatEvery);
                            endEventTime.setDate(endEventTime.getDate() + repeatEvery);
                            break;
                        case 'Week':
                            startEventTime.setDate(startEventTime.getDate() + repeatEvery * 7);
                            endEventTime.setDate(endEventTime.getDate() + repeatEvery * 7);
                            break;
                        case 'Month':
                            startEventTime.setMonth(startEventTime.getDate() + repeatEvery);
                            endEventTime.setMonth(endEventTime.getDate() + repeatEvery);
                            break;
                        case 'Year':
                            startEventTime.setFullYear(startEventTime.getFullYear() + repeatEvery);
                            endEventTime.setFullYear(endEventTime.getFullYear() + repeatEvery);
                            break;
                        default:
                            break;
                    }
                }
                //Create new event
                yield Event_entity_1.Event.create(Object.assign(Object.assign({}, dataNewEvent), { clients: [...eventClients], employees: [...eventEmployees], starts_on_date: new Date(startEventTime), ends_on_date: new Date(endEventTime) })).save();
            }
        }
        else {
            //Create new event
            yield Event_entity_1.Event.create(Object.assign(Object.assign({}, dataNewEvent), { clients: [...eventClients], employees: [...eventEmployees], starts_on_date: new Date(startEventTime), ends_on_date: new Date(endEventTime) })).save();
        }
        //Create note for employees or clients
        //Notification for employee
        yield Promise.all(eventEmployees.map((employee) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //create new notification
                yield Notification_entity_1.Notification.create({
                    employee,
                    url: '/events',
                    content: 'You have been assigned to a new event',
                }).save();
                resolve(true);
            }));
        })));
        //Notification for client
        yield Promise.all(eventClients.map((client) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //create new notification
                yield Notification_entity_1.Notification.create({
                    client,
                    url: '/events',
                    content: 'You have been assigned to a new event',
                }).save();
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Created new Events successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decode)
            return res.status(400).json({
                code: 401,
                success: false,
                message: 'Please login first',
            });
        const { employee, client, name } = req.query;
        var filter = {};
        if (name)
            filter.name = (0, typeorm_1.Like)(name);
        if (employee)
            filter.employees = {
                id: Number(employee),
            };
        if (decode.role === 'Employee')
            filter.employees = {
                id: Number(decode.userId),
            };
        if (client)
            filter.clients = {
                id: Number(client),
            };
        if (decode.role === 'Client')
            filter.clients = {
                id: Number(decode.userId),
            };
        const allEvent = yield Event_entity_1.Event.find({
            where: filter,
        });
        return res.status(200).json({
            code: 200,
            success: true,
            Events: allEvent,
            message: 'Get all Events successfully',
        });
    })),
    getByEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //check exist current user
        const { employeeId } = req.params;
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId)
            }
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 401,
                success: false,
                message: 'Not found employee',
            });
        //Get all event of employee
        const allEvent = yield Event_entity_1.Event.find({
            where: {
                employees: {
                    id: existingEmployee.id
                }
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            Events: allEvent,
            message: 'Get all Events by employee successfully',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get id event
        const { eventId } = req.params;
        const existingEvent = yield Event_entity_1.Event.findOne({
            where: {
                id: Number(eventId),
            },
        });
        if (!existingEvent)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Event doest not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            event: existingEvent,
            message: 'Get detail Event successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get id event
        const { eventId } = req.params;
        const existingEvent = yield Event_entity_1.Event.findOne({
            where: {
                id: Number(eventId),
            },
        });
        if (!existingEvent)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Event doest not exist in the system',
            });
        //Delete event
        existingEvent.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted Event successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //get id event
        const { eventId } = req.params;
        const dataUpdateEvent = req.body;
        const { clientEmails, employeeEmails } = dataUpdateEvent;
        const eventEmployees = [];
        const eventClients = [];
        //Check existing event
        const existingEvent = yield Event_entity_1.Event.findOne({
            where: {
                id: Number(eventId),
            },
        });
        if (!existingEvent)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Event doest not exist in the system',
            });
        //Check valid input update event
        //Check valid
        const messageValid = eventValid_1.eventValid.createOrUpdate(dataUpdateEvent);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check exist clients
        for (let index = 0; index < clientEmails.length; index++) {
            const clientsEmail = clientEmails[index];
            const existingClient = yield Client_entity_1.Client.findOne({
                where: {
                    email: clientsEmail,
                },
            });
            if (!existingClient)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Client doest not exist in the system',
                });
            eventClients.push(existingClient);
        }
        //Check exist employee
        for (let index = 0; index < employeeEmails.length; index++) {
            const employeeEmail = employeeEmails[index];
            const existEmployee = yield Employee_entity_1.Employee.findOne({
                where: {
                    email: employeeEmail,
                },
            });
            if (!existEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employee doest not exist in the system',
                });
            eventEmployees.push(existEmployee);
        }
        //Update event
        existingEvent.clients = eventClients;
        (existingEvent.name = dataUpdateEvent.name),
            (existingEvent.where = dataUpdateEvent.where),
            (existingEvent.color = dataUpdateEvent.color),
            (existingEvent.description = dataUpdateEvent.description),
            (existingEvent.starts_on_date = new Date(new Date(dataUpdateEvent.starts_on_date))),
            (existingEvent.starts_on_time = dataUpdateEvent.starts_on_time),
            (existingEvent.ends_on_date = new Date(new Date(dataUpdateEvent.ends_on_date))),
            (existingEvent.ends_on_time = dataUpdateEvent.ends_on_time),
            (existingEvent.employees = eventEmployees),
            (existingEvent.clients = eventClients),
            yield existingEvent.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated Event successfully',
        });
    })),
};
exports.default = eventController;
