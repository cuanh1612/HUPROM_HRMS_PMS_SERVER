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
exports.Project_discussion_category = void 0;
const typeorm_1 = require("typeorm");
const Project_Discussion_Room_entity_1 = require("./Project_Discussion_Room.entity");
let Project_discussion_category = class Project_discussion_category extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Project_discussion_category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Project_discussion_category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "#16813D" }),
    __metadata("design:type", String)
], Project_discussion_category.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_Discussion_Room_entity_1.Project_Discussion_Room, (project_discussion_room) => project_discussion_room.project_discussion_category),
    __metadata("design:type", Array)
], Project_discussion_category.prototype, "project_discussion_rooms", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Project_discussion_category.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Project_discussion_category.prototype, "updatedAt", void 0);
Project_discussion_category = __decorate([
    (0, typeorm_1.Entity)()
], Project_discussion_category);
exports.Project_discussion_category = Project_discussion_category;
