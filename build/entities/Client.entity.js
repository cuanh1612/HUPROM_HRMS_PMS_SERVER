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
exports.Client = exports.enumRole = exports.enumGender = exports.enumSalutation = void 0;
const typeorm_1 = require("typeorm");
const Avatar_entity_1 = require("./Avatar.entity");
const Client_Category_entity_1 = require("./Client_Category.entity");
const Client_Sub_Category_entity_1 = require("./Client_Sub_Category.entity");
const Contract_entity_1 = require("./Contract.entity");
const Discussion_entity_1 = require("./Discussion.entity");
const Event_entity_1 = require("./Event.entity");
const Notification_entity_1 = require("./Notification.entity");
const StickyNote_entity_1 = require("./StickyNote.entity");
const Project_entity_1 = require("./Project.entity");
const Room_entity_1 = require("./Room.entity");
var enumSalutation;
(function (enumSalutation) {
    enumSalutation["MR"] = "Mr";
    enumSalutation["MRS"] = "Mrs";
    enumSalutation["MISS"] = "Miss";
    enumSalutation["DR"] = "Dr";
    enumSalutation["SIR"] = "Sir";
    enumSalutation["MADAM"] = "Madam";
})(enumSalutation = exports.enumSalutation || (exports.enumSalutation = {}));
var enumGender;
(function (enumGender) {
    enumGender["MALE"] = "Male";
    enumGender["FEMAILE"] = "Female";
    enumGender["OTHER"] = "Others";
})(enumGender = exports.enumGender || (exports.enumGender = {}));
var enumRole;
(function (enumRole) {
    enumRole["CLIENT"] = "Client";
})(enumRole = exports.enumRole || (exports.enumRole = {}));
let Client = class Client extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Client.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumSalutation, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "salutation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Client.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Client.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumGender, nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Client.prototype, "can_login", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Client.prototype, "can_receive_email", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Avatar_entity_1.Avatar, {
        cascade: true,
        eager: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Avatar_entity_1.Avatar)
], Client.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "official_website", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "gst_vat_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "office_phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "postal_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "company_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "shipping_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Client.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enumRole, default: enumRole.CLIENT }),
    __metadata("design:type", String)
], Client.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Client.prototype, "token_version", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_Category_entity_1.Client_Category, (client_category) => client_category.clients, {
        onDelete: 'SET NULL',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client_Category_entity_1.Client_Category)
], Client.prototype, "client_category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_Sub_Category_entity_1.Client_Sub_Category, (client_sub_category) => client_sub_category.clients, {
        onDelete: 'SET NULL',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Client_Sub_Category_entity_1.Client_Sub_Category)
], Client.prototype, "client_sub_category", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_entity_1.Project, (project) => project.client),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Client.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StickyNote_entity_1.Sticky_note, (stickyNote) => stickyNote.client),
    __metadata("design:type", Array)
], Client.prototype, "sticky_notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Contract_entity_1.Contract, (contract) => contract.client),
    __metadata("design:type", Array)
], Client.prototype, "contracts", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Event_entity_1.Event),
    (0, typeorm_1.JoinTable)({ name: 'event_client' }),
    __metadata("design:type", Array)
], Client.prototype, "events", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Discussion_entity_1.Discussion, (discussion) => discussion.client),
    __metadata("design:type", Array)
], Client.prototype, "discussions", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Room_entity_1.Room),
    (0, typeorm_1.JoinTable)({ name: 'room_client' }),
    __metadata("design:type", Array)
], Client.prototype, "rooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification_entity_1.Notification, (Notification) => Notification.client),
    __metadata("design:type", Array)
], Client.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bool", default: false }),
    __metadata("design:type", Boolean)
], Client.prototype, "root", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
    }),
    __metadata("design:type", Date)
], Client.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
    }),
    __metadata("design:type", Date)
], Client.prototype, "updatedAt", void 0);
Client = __decorate([
    (0, typeorm_1.Entity)()
], Client);
exports.Client = Client;
