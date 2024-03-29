"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const designation_controller_1 = __importDefault(require("../controllers/designation.controller"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const designationRouter = express_1.default.Router();
designationRouter.post('/', (0, checkAuth_1.checkAuth)(['Admin']), designation_controller_1.default.create);
designationRouter.put('/:id', (0, checkAuth_1.checkAuth)(['Admin']), designation_controller_1.default.update);
designationRouter.get('/', designation_controller_1.default.getAll);
designationRouter.get('/:id', designation_controller_1.default.getDetail);
designationRouter.delete('/:id', (0, checkAuth_1.checkAuth)(['Admin']), designation_controller_1.default.delete);
exports.default = designationRouter;
