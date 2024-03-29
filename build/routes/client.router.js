"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_controller_1 = __importDefault(require("../controllers/client.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const clientRouter = express_1.default.Router();
clientRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), client_controller_1.default.create);
clientRouter.post('/delete-many', (0, checkAuth_1.checkAuth)(['Admin']), client_controller_1.default.deleteMany);
clientRouter.put('/:clientId', (0, checkAuth_1.checkAuth)(['Admin']), client_controller_1.default.update);
clientRouter.get('/normal', client_controller_1.default.getNormal);
clientRouter.get('/', (0, checkAuth_1.checkAuth)([]), client_controller_1.default.getAll);
clientRouter.get('/:clientId', (0, checkAuth_1.checkAuth)([]), client_controller_1.default.getDetail);
clientRouter.get('/:clientId/total-projects', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), client_controller_1.default.totalProjects);
clientRouter.get('/:clientId/total-earnings', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), client_controller_1.default.totalEarnings);
clientRouter.get('/:clientId/status-projects', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), client_controller_1.default.statusProjects);
clientRouter.get('/:clientId/projects', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), client_controller_1.default.projects);
clientRouter.get('/:clientId/pending-milestone', (0, checkAuth_1.checkAuth)(['Admin', 'Client']), client_controller_1.default.pendingMilestone);
clientRouter.post('/csv', (0, checkAuth_1.checkAuth)(['Admin']), client_controller_1.default.importCSV);
clientRouter.delete('/:clientId', (0, checkAuth_1.checkAuth)(['Admin']), client_controller_1.default.delete);
exports.default = clientRouter;
