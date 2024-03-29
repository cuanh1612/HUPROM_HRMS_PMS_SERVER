"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Designation_entity_1 = require("../entities/Designation.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const designationController = {
    //Create new designation
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewDesignation = req.body;
        const { name } = dataNewDesignation;
        //check if the name of the designation already exists
        const existingName = yield Designation_entity_1.Designation.findOne({
            where: {
                name: String(name),
            },
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Department does not exist in the system',
            });
        const createDesignation = yield Designation_entity_1.Designation.create(dataNewDesignation).save();
        return res.status(200).json({
            code: 200,
            success: true,
            designation: createDesignation,
            message: 'Created new designation successfully',
        });
    })),
    //update designation
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateDesignation = req.body;
        const { name } = dataUpdateDesignation;
        //Check existing designation
        const existingDesignation = yield Designation_entity_1.Designation.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed designation
        if (!existingDesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            });
        if (name !== existingDesignation.name) {
            //check if the name of the designation already exists
            const existingName = yield Designation_entity_1.Designation.findOne({
                where: {
                    name: String(name),
                },
            });
            if (existingName)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Designation already exist in the system',
                });
        }
        //Update
        yield Designation_entity_1.Designation.update(existingDesignation.id, Object.assign({}, dataUpdateDesignation));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update designation successfully',
        });
    })),
    //Get all designation
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const designations = yield Designation_entity_1.Designation.find();
        return res.status(200).json({
            code: 200,
            success: true,
            designations: designations,
            message: 'Get all designation successfully',
        });
    })),
    //Get detail designation
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingDesignation = yield Designation_entity_1.Designation.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingDesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            designation: existingDesignation,
            message: 'Get detail of designation successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingDesignation = yield Designation_entity_1.Designation.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingDesignation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'designation does not exist in the system',
            });
        //Delete designation
        yield existingDesignation.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete designation successfully',
        });
    })),
};
exports.default = designationController;
