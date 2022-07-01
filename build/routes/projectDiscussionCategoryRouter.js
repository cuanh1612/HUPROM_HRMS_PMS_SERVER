"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectDiscussionCategoryController_1 = __importDefault(require("../controllers/projectDiscussionCategoryController"));
const checkAuth_1 = require("../utils/middleware/checkAuth");
const projectDiscussionCategoryRouter = express_1.default.Router();
projectDiscussionCategoryRouter.post('/', (0, checkAuth_1.checkAuth)([]), projectDiscussionCategoryController_1.default.create);
projectDiscussionCategoryRouter.get('/', projectDiscussionCategoryController_1.default.getAll);
projectDiscussionCategoryRouter.get('/:id', projectDiscussionCategoryController_1.default.getDetail);
projectDiscussionCategoryRouter.delete('/:id', (0, checkAuth_1.checkAuth)([]), projectDiscussionCategoryController_1.default.delete);
projectDiscussionCategoryRouter.put('/:id', (0, checkAuth_1.checkAuth)([]), projectDiscussionCategoryController_1.default.update);
exports.default = projectDiscussionCategoryRouter;
