"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveValid = void 0;
const Leave_1 = require("../../entities/Leave");
exports.leaveValid = {
    createOrUpdate: ({ status, duration, employee, leave_type, dates, date, }) => {
        let messageError = '';
        if (!employee || !leave_type || (!dates && !date)) {
            messageError = 'Pleas enter full field';
            return messageError;
        }
        if (status &&
            status !== Leave_1.enumStatus.APPROVED &&
            status !== Leave_1.enumStatus.PENDING &&
            status !== Leave_1.enumStatus.REJECTED) {
            messageError = 'Status not valid';
            return messageError;
        }
        if (duration && duration !== Leave_1.enumDuration.HALF_DAY && duration !== Leave_1.enumDuration.SINGLE) {
            messageError = 'Duration not valid';
            return messageError;
        }
        return messageError;
    },
    updateStatus: (status) => {
        let messageError = '';
        if (!status)
            messageError = 'Pleas enter full field';
        if (status === Leave_1.enumStatus.PENDING)
            messageError = 'Please select status approved or rejected';
        if (status && status !== Leave_1.enumStatus.APPROVED && status !== Leave_1.enumStatus.REJECTED) {
            messageError = 'Status not valid';
            return messageError;
        }
        return messageError;
    },
};
