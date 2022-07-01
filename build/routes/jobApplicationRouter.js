"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = __importDefault(require("../controllers/jobController"));
const jobApplicationRouter = express_1.default.Router();
jobApplicationRouter.post('/', jobController_1.default.create);
jobApplicationRouter.delete('/delete-many', jobController_1.default.delete);
jobApplicationRouter.delete('/delete-many', jobController_1.default.deleteMany);
jobApplicationRouter.get('/', jobController_1.default.getAll);
jobApplicationRouter.get('/:id', jobController_1.default.getDetail);
jobApplicationRouter.put('/:id', jobController_1.default.update);
jobApplicationRouter.put('/change-status', jobController_1.default.changeStatusMany);
exports.default = jobApplicationRouter;
