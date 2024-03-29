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
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const jobApplicationValid_1 = require("../utils/valid/jobApplicationValid");
const Job_entity_1 = require("../entities/Job.entity");
const Location_entity_1 = require("../entities/Location.entity");
const Job_Application_entity_1 = require("../entities/Job_Application.entity");
const Job_Application_Picture_entity_1 = require("../entities/Job_Application_Picture.entity");
const Skill_entity_1 = require("../entities/Skill.entity");
const Job_Application_File_entity_1 = require("../entities/Job_Application_File.entity");
const jobApplicationController = {
    updateStatus: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { status } = req.body;
        if (!id) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        }
        const existingJob = yield Job_Application_entity_1.Job_Application.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJob) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job application not exist in system',
            });
        }
        existingJob.status = status;
        yield existingJob.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update status successfully ',
        });
    })),
    //create new job application
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewJobApplication = req.body;
        const { jobs, location, files } = dataNewJobApplication;
        const messageValid = jobApplicationValid_1.jobApplicationValid.createOrUpdate(dataNewJobApplication);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                succesS: false,
                message: messageValid,
            });
        //check exist jobs
        const existingJobs = yield Job_entity_1.Job.findOne({
            where: {
                id: jobs,
            },
        });
        if (!existingJobs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        //check exist location
        const existingLocation = yield Location_entity_1.Location.findOne({
            where: {
                id: location,
            },
        });
        if (!existingLocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Location does not existing in the system',
            });
        // Create job application
        const createJobApplication = yield Job_Application_entity_1.Job_Application.create(Object.assign({}, dataNewJobApplication)).save();
        // Create files for job application
        if (files && Array.isArray(files)) {
            files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield Job_Application_File_entity_1.Job_application_file.create(Object.assign(Object.assign({}, file), { job_application: createJobApplication })).save();
            }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            job_application: createJobApplication,
            message: ' Create job application',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { id } = req.params;
        const dataUpdateJobApplication = req.body;
        const { location, jobs } = dataUpdateJobApplication;
        //check exist job application
        const existingJobApplication = yield Job_Application_entity_1.Job_Application.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job Application does not exist in the system',
            });
        //check exist jobs
        const existingJobs = yield Job_entity_1.Job.findOne({
            where: {
                id: jobs,
            },
        });
        if (!existingJobs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system',
            });
        //check exist location
        const existingLocation = yield Location_entity_1.Location.findOne({
            where: {
                id: location,
            },
        });
        if (!existingLocation)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Location does not existing in the system',
            });
        //Delete old picture
        const oldPictureId = ((_a = existingJobApplication === null || existingJobApplication === void 0 ? void 0 : existingJobApplication.picture) === null || _a === void 0 ? void 0 : _a.id) || undefined;
        (existingJobApplication.name = dataUpdateJobApplication.name),
            (existingJobApplication.email = dataUpdateJobApplication.email),
            (existingJobApplication.jobs = dataUpdateJobApplication.jobs),
            (existingJobApplication.location = dataUpdateJobApplication.location),
            (existingJobApplication.mobile = dataUpdateJobApplication.mobile),
            (existingJobApplication.picture = dataUpdateJobApplication.picture),
            (existingJobApplication.cover_leter = dataUpdateJobApplication.cover_leter),
            (existingJobApplication.status = dataUpdateJobApplication.status),
            (existingJobApplication.source = dataUpdateJobApplication.source);
        yield existingJobApplication.save();
        if (dataUpdateJobApplication.picture && oldPictureId) {
            const existingJobApplicationPicture = yield Job_Application_Picture_entity_1.Job_application_picture.findOne({
                where: {
                    id: oldPictureId,
                },
            });
            if (existingJobApplicationPicture) {
                yield existingJobApplicationPicture.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update job application success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingJobApplication = yield Job_Application_entity_1.Job_Application.findOne({
            where: {
                id: Number(id),
            },
            relations: {
                jobs: true,
                location: true,
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job application does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            jobApplication: existingJobApplication,
            message: 'Get detail of job application success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const jobApplications = yield Job_Application_entity_1.Job_Application.find({
            relations: {
                location: true,
                jobs: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            jobApplications,
            message: 'Get all job application success',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { id } = req.params;
        const existingJobApplication = yield Job_Application_entity_1.Job_Application.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingJobApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This job application does not exist in the system',
            });
        //Delete picture job application
        const pictureId = ((_b = existingJobApplication === null || existingJobApplication === void 0 ? void 0 : existingJobApplication.picture) === null || _b === void 0 ? void 0 : _b.id) || undefined;
        //Delete job application
        yield existingJobApplication.remove();
        if (pictureId) {
            const existingJobApplicationPicture = yield Job_Application_Picture_entity_1.Job_application_picture.findOne({
                where: {
                    id: pictureId,
                },
            });
            if (existingJobApplicationPicture) {
                yield existingJobApplicationPicture.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'delete job application success',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { jobApplications } = req.body;
        //check array of job applications
        if (!Array.isArray(jobApplications))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'job application does not existing in the system',
            });
        yield Promise.all(jobApplications.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingJobApplication = yield Job_Application_entity_1.Job_Application.findOne({
                    where: {
                        id: id,
                    },
                });
                if (existingJobApplication) {
                    //Delete picture job application
                    const pictureId = existingJobApplication.picture ? existingJobApplication.picture.id : undefined;
                    //Delete job application
                    yield Job_Application_entity_1.Job_Application.remove(existingJobApplication);
                    if (pictureId) {
                        const existingJobApplicationpicture = yield Job_Application_Picture_entity_1.Job_application_picture.findOne({
                            where: {
                                id: pictureId,
                            },
                        });
                        if (existingJobApplicationpicture) {
                            yield existingJobApplicationpicture.remove();
                        }
                    }
                }
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete job applications success',
        });
    })),
    changeStatusMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { job_applications } = req.body;
        const { status } = req.body;
        //check array of job applications
        if (!Array.isArray(job_applications || job_applications))
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'job application does not existing in the system',
            });
        yield Promise.all(job_applications.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingJobApplication = yield Job_Application_entity_1.Job_Application.findOne({
                    where: {
                        id: id,
                    },
                });
                if (existingJobApplication) {
                    existingJobApplication.status = status;
                }
                yield (existingJobApplication === null || existingJobApplication === void 0 ? void 0 : existingJobApplication.save());
                resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'change status job applications success',
        });
    })),
    changeSkills: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { skills, jobApplicationId } = req.body;
        let listValidSkill = [];
        //Check existiong joapplication
        const existingApplication = yield Job_Application_entity_1.Job_Application.findOne({
            where: {
                id: jobApplicationId
            }
        });
        if (!existingApplication)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Existing Application does not exist in the system',
            });
        if (!Array.isArray(skills) || skills.length === 0)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please select skills for this job application',
            });
        yield Promise.all(skills.map((skillId) => {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                //Check existing skill
                const existingSkill = yield Skill_entity_1.Skill.findOne({
                    where: {
                        id: skillId,
                    },
                });
                if (existingSkill) {
                    listValidSkill.push(existingSkill);
                }
                return resolve(true);
            }));
        }));
        //Update skill
        if (listValidSkill.length > 0) {
            existingApplication.skills = listValidSkill;
            yield existingApplication.save();
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Change skills for job application success',
        });
    })),
    getByJob: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { JobId } = req.params;
        const existingJob = yield Job_entity_1.Job.findOne({
            where: {
                id: Number(JobId)
            },
        });
        if (!existingJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job does not existing in the system'
            });
        const jobApplicationsByJob = yield Job_Application_entity_1.Job_Application.find({
            where: {
                jobs: {
                    id: Number(JobId)
                }
            },
            relations: {
                location: true,
                jobs: true,
                skills: true
            },
        });
        if (!jobApplicationsByJob)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Job application does not existing in the system'
            });
        return res.status(200).json({
            code: 200,
            success: true,
            jobApplications: jobApplicationsByJob,
            message: 'Get job application by job success'
        });
    }))
};
exports.default = jobApplicationController;
