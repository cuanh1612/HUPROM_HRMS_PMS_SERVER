"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attendanceRouter_1 = __importDefault(require("./attendanceRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
const clientCategoryRouter_1 = __importDefault(require("./clientCategoryRouter"));
const clientRouter_1 = __importDefault(require("./clientRouter"));
const clientSubCategoryRouter_1 = __importDefault(require("./clientSubCategoryRouter"));
const contractFileRouter_1 = __importDefault(require("./contractFileRouter"));
const contractRouter_1 = __importDefault(require("./contractRouter"));
const contractTypeRouter_1 = __importDefault(require("./contractTypeRouter"));
const projectCategoryRouter_1 = __importDefault(require("./projectCategoryRouter"));
const projectRouter_1 = __importDefault(require("./projectRouter"));
const conversationReplyRouter_1 = __importDefault(require("./conversationReplyRouter"));
const conversationRouter_1 = __importDefault(require("./conversationRouter"));
const departmentRouter_1 = __importDefault(require("./departmentRouter"));
const designationRouter_1 = __importDefault(require("./designationRouter"));
const discussionRouter_1 = __importDefault(require("./discussionRouter"));
const employeeRouter_1 = __importDefault(require("./employeeRouter"));
const eventRouter_1 = __importDefault(require("./eventRouter"));
const holidayRouter_1 = __importDefault(require("./holidayRouter"));
const leaveRouter_1 = __importDefault(require("./leaveRouter"));
const leaveTypeRouter_1 = __importDefault(require("./leaveTypeRouter"));
const signRouter_1 = __importDefault(require("./signRouter"));
const taskCategoryRouter_copy_1 = __importDefault(require("./taskCategoryRouter copy"));
const projectFileRouter_1 = __importDefault(require("./projectFileRouter"));
const taskFileRouter_copy_1 = __importDefault(require("./taskFileRouter copy"));
<<<<<<< HEAD
const projectDiscussionCategoryRouter_1 = __importDefault(require("./projectDiscussionCategoryRouter"));
const projectDiscussionReplyRouter_1 = __importDefault(require("./projectDiscussionReplyRouter"));
function mainRouter(app) {
=======
const dashboardRouter_1 = __importDefault(require("./dashboardRouter"));
const salaryRouter_1 = __importDefault(require("./salaryRouter"));
const mainRouter = (app) => {
>>>>>>> fdeb6aa819f872be90108d0c1efe5ee7240bdc21
    app.use('/api/auth', authRouter_1.default);
    app.use('/api/employees', employeeRouter_1.default);
    app.use('/api/departments', departmentRouter_1.default);
    app.use('/api/designations', designationRouter_1.default);
    app.use('/api/leave-types', leaveTypeRouter_1.default);
    app.use('/api/leaves', leaveRouter_1.default);
    app.use('/api/clients', clientRouter_1.default);
    app.use('/api/holidays', holidayRouter_1.default);
    app.use('/api/client-categories', clientCategoryRouter_1.default);
    app.use('/api/client-sub-categories', clientSubCategoryRouter_1.default);
    app.use('/api/contracts', contractRouter_1.default);
    app.use('/api/contract-types', contractTypeRouter_1.default);
    app.use('/api/project-categories', projectCategoryRouter_1.default);
    app.use('/api/projects', projectRouter_1.default);
    app.use('/api/attendances', attendanceRouter_1.default);
    app.use('/api/signs', signRouter_1.default);
    app.use('/api/conversations', conversationRouter_1.default);
    app.use('/api/conversation-replies', conversationReplyRouter_1.default);
    app.use('/api/discussions', discussionRouter_1.default);
    app.use('/api/contract-files', contractFileRouter_1.default);
    app.use('/api/events', eventRouter_1.default);
    app.use('/api/task-categories', taskCategoryRouter_copy_1.default);
    app.use('/api/project-files', projectFileRouter_1.default);
    app.use('/api/task-files', taskFileRouter_copy_1.default);
<<<<<<< HEAD
    app.use('/api/project-discussion-categories', projectDiscussionCategoryRouter_1.default);
    app.use('/api/project-discussion-reply', projectDiscussionReplyRouter_1.default);
}
=======
    app.use('/api/dashboard', dashboardRouter_1.default);
    app.use('/api/salaries', salaryRouter_1.default);
};
>>>>>>> fdeb6aa819f872be90108d0c1efe5ee7240bdc21
exports.default = mainRouter;
