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
var Task_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.enumPriority = exports.enumStatus = void 0;
const typeorm_1 = require("typeorm");
const Employee_1 = require("./Employee");
const Project_1 = require("./Project");
const Task_Category_1 = require("./Task_Category");
const Task_File_1 = require("./Task_File");
var enumStatus;
(function (enumStatus) {
    enumStatus["INCOMPLETE"] = "Incomplete";
    enumStatus["TO_DO"] = "To Do";
    enumStatus["DOING"] = "Doing";
    enumStatus["COMPLETED"] = "Completed";
})(enumStatus = exports.enumStatus || (exports.enumStatus = {}));
var enumPriority;
(function (enumPriority) {
    enumPriority["LOW"] = "Low";
    enumPriority["MEDIUM"] = "Medium";
    enumPriority["HIGH"] = "High";
})(enumPriority = exports.enumPriority || (exports.enumPriority = {}));
let Task = Task_1 = class Task extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Task.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Task.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Task.prototype, "start_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Task.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_Category_1.Task_Category, (task_Category) => task_Category.tasks, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Task_Category_1.Task_Category)
], Task.prototype, "task_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.tasks, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_1.Project)
], Task.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Employee_1.Employee, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)({ name: 'task_employee' }),
    __metadata("design:type", Array)
], Task.prototype, "employees", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumStatus, default: enumStatus.TO_DO }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumPriority, default: enumPriority.LOW }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_1, (task) => task.tasks, {
        onDelete: "SET NULL"
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Task)
], Task.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_1, (task) => task.task),
    __metadata("design:type", Array)
], Task.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_File_1.Task_file, (task_file) => task_file.task, {
        onDelete: 'SET NULL',
        nullable: true
    }),
    __metadata("design:type", Array)
], Task.prototype, "task_files", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Task.prototype, "updatedAt", void 0);
Task = Task_1 = __decorate([
    (0, typeorm_1.Entity)()
], Task);
exports.Task = Task;
