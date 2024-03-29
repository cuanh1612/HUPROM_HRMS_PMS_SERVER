"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timeLog_controller_1 = __importDefault(require("../controllers/timeLog.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const TimeLogRouter = express_1.default.Router();
TimeLogRouter.post('/delete-many', (0, checkAuth_1.checkAuth)([]), timeLog_controller_1.default.deleteMany);
TimeLogRouter.get('/calendar', timeLog_controller_1.default.calendar);
TimeLogRouter.get('/calendar-employee/:employeeId', timeLog_controller_1.default.calendarByEmployee);
TimeLogRouter.post('/', (0, checkAuth_1.checkAuth)([]), timeLog_controller_1.default.create);
TimeLogRouter.get('/current-user', timeLog_controller_1.default.getByCurrentUser);
TimeLogRouter.get('/by-project/:projectId', timeLog_controller_1.default.getAllByProject);
TimeLogRouter.get('/:timelogId', timeLog_controller_1.default.getDetail);
TimeLogRouter.get('/', timeLog_controller_1.default.getAll);
TimeLogRouter.delete('/:timeLogId', (0, checkAuth_1.checkAuth)([]), timeLog_controller_1.default.delete);
TimeLogRouter.put('/:timeLogId', (0, checkAuth_1.checkAuth)([]), timeLog_controller_1.default.update);
TimeLogRouter.get('/employee/:employeeId', timeLog_controller_1.default.getByEmployee);
exports.default = TimeLogRouter;
