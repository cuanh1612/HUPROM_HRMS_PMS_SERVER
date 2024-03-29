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
const Company_Info_entity_1 = require("../entities/Company_Info.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const companyInfoValid_1 = require("../utils/valid/companyInfoValid");
const companyInfoController = {
    //Get info company 
    getInfo: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const companyInfo = (yield Company_Info_entity_1.Company_Info.find({}))[0];
        if (!companyInfo) {
            //Create new company info
            const createdCompanyInfo = yield Company_Info_entity_1.Company_Info.create({
                name: "HUPROM",
                email: "hoangdev161201@gmail.com",
                phone: "84833876372",
                website: "huprom.com"
            }).save();
            return res.status(200).json({
                code: 200,
                success: true,
                companyInfo: createdCompanyInfo,
                message: 'Get company info successfully',
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            companyInfo,
            message: 'Get company info successfully',
        });
    })),
    //update companyInfo
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataUpdateCompanyInfo = req.body;
        const { email, website, name, phone, logo_name, logo_url, logo_public_id, terms_and_condition_recruit } = dataUpdateCompanyInfo;
        //Check valid
        const messageValid = companyInfoValid_1.companyInfoValid.createOrUpdate(dataUpdateCompanyInfo);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        const companyInfo = (yield Company_Info_entity_1.Company_Info.find({}))[0];
        if (!companyInfo) {
            //Create new company info
            yield Company_Info_entity_1.Company_Info.create({
                name: name ? name : "HUPROM",
                email: email ? email : "hoangdev161201@gmail.com",
                phone: phone ? phone : "84833876372",
                website: website ? website : "huprom.com"
            }).save();
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Update Company Info Successfully',
            });
        }
        //Update companyInfo
        Company_Info_entity_1.Company_Info.update(companyInfo.id, {
            name: name ? name : undefined,
            website: website ? website : undefined,
            phone: phone ? phone : undefined,
            email: email ? email : undefined,
            logo_name: logo_name ? logo_name : undefined,
            logo_public_id: logo_public_id ? logo_public_id : undefined,
            logo_url: logo_url ? logo_url : undefined,
            terms_and_condition_recruit: terms_and_condition_recruit ? terms_and_condition_recruit : undefined
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Company Info Successfully',
        });
    })),
};
exports.default = companyInfoController;
