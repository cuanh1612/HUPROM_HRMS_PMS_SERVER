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
const Conversation_1 = require("../entities/Conversation");
const Employee_1 = require("../entities/Employee");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const conversationController = {
    //Create new conversation
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewConversation = req.body;
        const { user_one, user_two } = dataNewConversation;
        //Check same user
        if (user_one === user_two)
            return res.status(400).json({
                code: 400,
                success: false,
                message: "You can't create a conversation with yourself",
            });
        //check user exists
        const existingUserOne = yield Employee_1.Employee.findOne({
            where: {
                id: user_one,
            },
        });
        const existingUserTwo = yield Employee_1.Employee.findOne({
            where: {
                id: user_two,
            },
        });
        if (!existingUserOne || !existingUserTwo)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check employee assign conversation
        const conversations = yield Conversation_1.Conversation.find({
            relations: {
                employees: true,
            },
            where: {
                employees: [{ id: existingUserOne.id }],
            },
        });
        console.log(conversations);
        let isExistConversation = false;
        for (let index = 0; index < conversations.length; index++) {
            const conversation = conversations[index];
            if (conversation.employees.some((employee) => employee.id === existingUserTwo.id)) {
                isExistConversation = true;
                break;
            }
        }
        if (isExistConversation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Conversation already exist in the system',
            });
        //Create new conversation
        const createdConversation = yield Conversation_1.Conversation.create({
            employees: [existingUserOne, existingUserTwo],
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            conversation: createdConversation,
            message: 'Created new conversation successfully',
        });
    })),
    getByUser: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        //Check exist userId
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: Number(userId),
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Get all conversations of employee
        const conversations = yield Conversation_1.Conversation.find({
            where: {
                employees: [{ id: existingUser.id }],
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            conversations,
            message: 'Get conversations successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { conversationId, userId } = req.params;
        //Check exist conversation
        const existingConversation = yield Conversation_1.Conversation.findOne({
            where: {
                id: Number(conversationId),
            },
        });
        if (!existingConversation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Conversation does not exist in the system',
            });
        //Check exist user
        const existingUser = yield Employee_1.Employee.findOne({
            where: {
                id: Number(userId),
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check user exist in the conversation
        if (!existingConversation.employees.some((employee) => employee.id === existingUser.id))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the conversation',
            });
        yield existingConversation.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete conversation successfully',
        });
    })),
};
exports.default = conversationController;