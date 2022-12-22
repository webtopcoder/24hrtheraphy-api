"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerOfflineException = void 0;
const common_1 = require("@nestjs/common");
class PerformerOfflineException extends common_1.HttpException {
    constructor() {
        super('Performer is offline', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.PerformerOfflineException = PerformerOfflineException;
//# sourceMappingURL=performer-offline.exception.js.map