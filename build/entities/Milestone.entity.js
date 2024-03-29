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
exports.Milestone = void 0;
const typeorm_1 = require("typeorm");
const Project_entity_1 = require("./Project.entity");
const Task_entity_1 = require("./Task.entity");
let Milestone = class Milestone extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Milestone.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Milestone.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Number)
], Milestone.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Milestone.prototype, "addtobudget", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Milestone.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Milestone.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_entity_1.Project, (project) => project.milestones, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Project_entity_1.Project)
], Milestone.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_entity_1.Task, (task) => task.milestone, {
        nullable: true,
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Milestone.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Milestone.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Milestone.prototype, "updatedAt", void 0);
Milestone = __decorate([
    (0, typeorm_1.Entity)()
], Milestone);
exports.Milestone = Milestone;
