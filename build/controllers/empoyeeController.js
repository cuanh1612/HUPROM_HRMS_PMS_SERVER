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
const Employee_1 = require("../entities/Employee");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const employeeValid_1 = require("../utils/valid/employeeValid");
const employeeController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewEmployee = req.body;
        //Check valid
        const messageValid = employeeValid_1.employeeValid.create(dataNewEmployee);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Create new employee
        const newEmployee = Employee_1.Employee.create(Object.assign({}, dataNewEmployee));
        const createdEmployee = yield newEmployee.save();
        return res.status(200).json({
            code: 200,
            success: true,
            employee: createdEmployee,
            message: 'Created new employee successfully',
        });
    })),
};
exports.default = employeeController;