"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountPendingException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class AccountPendingException extends common_1.HttpException {
    constructor() {
        super(constants_1.ACCOUNT_PENDING, 400);
    }
}
exports.AccountPendingException = AccountPendingException;
//# sourceMappingURL=account-pending.exception.js.map