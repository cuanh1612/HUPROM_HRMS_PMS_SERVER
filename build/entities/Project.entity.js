"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.enumProjectStatus = exports.enumCurrency = void 0;
const typeorm_1 = require("typeorm");
const Client_entity_1 = require("./Client.entity");
const Department_entity_1 = require("./Department.entity");
const Employee_entity_1 = require("./Employee.entity");
const Hourly_rate_project_entity_1 = require("./Hourly_rate_project.entity");
const Milestone_entity_1 = require("./Milestone.entity");
const Project_Activity_entity_1 = require("./Project_Activity.entity");
const Project_Category_entity_1 = require("./Project_Category.entity");
const Project_Discussion_Room_entity_1 = require("./Project_Discussion_Room.entity");
const Project_File_entity_1 = require("./Project_File.entity");
const Project_Note_entity_1 = require("./Project_Note.entity");
const Status_entity_1 = require("./Status.entity");
const Task_entity_1 = require("./Task.entity");
const Time_Log_entity_1 = require("./Time_Log.entity");
var enumCurrency;
(function (enumCurrency) {
    enumCurrency["USD"] = "USD";
    enumCurrency["GBP"] = "GBP";
    enumCurrency["EUR"] = "EUR";
    enumCurrency["INR"] = "INR";
    enumCurrency["VND"] = "VND";
})(enumCurrency = exports.enumCurrency || (exports.enumCurrency = {}));
var enumProjectStatus;
(function (enumProjectStatus) {
    enumProjectStatus["NOT_STARTED"] = "Not Started";
    enumProjectStatus["IN_PROGRESS"] = "In Progress";
    enumProjectStatus["ON_HOLD"] = "On Hold";
    enumProjectStatus["CANCELED"] = "Canceled";
    enumProjectStatus["FINISHED"] = "Finished";
})(enumProjectStatus = exports.enumProjectStatus || (exports.enumProjectStatus = {}));
let Project = class Project extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Project.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Project.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "project_summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Project.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "project_budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "hours_estimate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Project.prototype, "send_task_noti", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_Category_entity_1.Project_Category, (project_Category) => project_Category.projects, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_Category_entity_1.Project_Category)
], Project.prototype, "project_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_entity_1.Department, (department) => department.projects, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Department_entity_1.Department)
], Project.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_entity_1.Client, (client) => client.projects, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client_entity_1.Client)
], Project.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Employee_entity_1.Employee, { onDelete: 'CASCADE', eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'project_employee' }),
    __metadata("design:type", Array)
], Project.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumCurrency, default: enumCurrency.USD }),
    __metadata("design:type", String)
], Project.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Project.prototype, "Progress", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_entity_1.Employee, (Employee) => Employee.projects, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_entity_1.Employee)
], Project.prototype, "Added_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_File_entity_1.Project_file, (project_file) => project_file.project, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    __metadata("design:type", Array)
], Project.prototype, "project_files", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_Activity_entity_1.Project_Activity, (project_activities) => project_activities.project, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    __metadata("design:type", Array)
], Project.prototype, "project_activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Time_Log_entity_1.Time_log, (time_log) => time_log.project, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Project.prototype, "time_logs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_Discussion_Room_entity_1.Project_Discussion_Room, (project_Discussion_Room) => project_Discussion_Room.project, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    __metadata("design:type", Array)
], Project.prototype, "project_discussion_rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Status_entity_1.Status, (status) => status.project),
    __metadata("design:type", Status_entity_1.Status)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employee_entity_1.Employee, (employee) => employee.projects_management),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Employee_entity_1.Employee)
], Project.prototype, "project_Admin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_entity_1.Task, (task) => task.project, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], Project.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Hourly_rate_project_entity_1.Hourly_rate_project, hourly_rate_project => hourly_rate_project.project),
    __metadata("design:type", Array)
], Project.prototype, "hourly_rate_projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Milestone_entity_1.Milestone, (milestone) => milestone.project, {
        onDelete: 'SET NULL'
    }),
    __metadata("design:type", Array)
], Project.prototype, "milestones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_Note_entity_1.Project_note, (project_notice) => project_notice.project, {
        onDelete: 'SET NULL',
    }),
    __metadata("design:type", Array)
], Project.prototype, "project_notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Time_Log_entity_1.Time_log, (timelog) => timelog.project, {
        onDelete: 'SET NULL',
        nullable: true,
    }),
    __metadata("design:type", Array)
], Project.prototype, "timelogs", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumProjectStatus, default: enumProjectStatus.NOT_STARTED }),
    __metadata("design:type", String)
], Project.prototype, "project_status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Project.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Project.prototype, "updatedAt", void 0);
Project = __decorate([
    (0, typeorm_1.Entity)()
], Project);
exports.Project = Project;
