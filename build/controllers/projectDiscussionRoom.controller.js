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
const Employee_entity_1 = require("../entities/Employee.entity");
const Project_entity_1 = require("../entities/Project.entity");
const Project_Discussion_Category_entity_1 = require("../entities/Project_Discussion_Category.entity");
const Project_Discussion_Reply_entity_1 = require("../entities/Project_Discussion_Reply.entity");
const Project_Discussion_Room_entity_1 = require("../entities/Project_Discussion_Room.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectDiscussionRoomValid_1 = require("../utils/valid/projectDiscussionRoomValid");
const projectDiscussionRoomController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewPDiscussionRoom = req.body;
        const { project, project_discussion_category, description } = dataNewPDiscussionRoom;
        const messageValid = projectDiscussionRoomValid_1.projectDiscussionRoomValid.createOrUpdate(dataNewPDiscussionRoom);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exists project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: project
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            });
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id) && decode.role !== "Admin")
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization'
            });
        if (project_discussion_category) {
            //check exist project discussion category
            const existingPDCategory = yield Project_Discussion_Category_entity_1.Project_discussion_category.findOne({
                where: {
                    id: project_discussion_category
                }
            });
            if (!existingPDCategory)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Project Discussion Category does not exist in the system'
                });
        }
        const createRoom = yield Project_Discussion_Room_entity_1.Project_Discussion_Room.create(Object.assign(Object.assign({}, dataNewPDiscussionRoom), { assigner: existingUser })).save();
        //create first reply
        yield Project_Discussion_Reply_entity_1.Project_discussion_reply.create({
            reply: description,
            project_discussion_room: createRoom,
            employee: existingUser
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom: createRoom,
            message: 'Create new project discussion room success',
        });
    })),
    Delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { id } = req.params;
        const existingDiscussionRoom = yield Project_Discussion_Room_entity_1.Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            },
            select: {
                project: {
                    id: true
                }
            },
            relations: {
                project: true
            }
        });
        if (!existingDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            });
        //get project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: existingDiscussionRoom.project.id
            }
        });
        if (!existingProject) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            });
        }
        //check exist current user
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system'
            });
        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization'
            });
        yield existingDiscussionRoom.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'delete project discussion room success'
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingDiscussionRoom = yield Project_Discussion_Room_entity_1.Project_Discussion_Room.findOne({
            where: {
                id: Number(id)
            }
        });
        if (!existingDiscussionRoom)
            return res.status(400).json({
                code: 400,
                success: false,
                message: ' Project discussion room does not exist in the system'
            });
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRoom: existingDiscussionRoom,
            Message: 'Get detail project discussion room success'
        });
    })),
    getByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { project_id } = req.params;
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(project_id)
            }
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system'
            });
        const projectDiscussionRooms = yield Project_Discussion_Room_entity_1.Project_Discussion_Room.find({
            where: {
                project: {
                    id: existingProject.id
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionRooms,
            message: 'Get project discussion room by project success'
        });
    }))
};
exports.default = projectDiscussionRoomController;
