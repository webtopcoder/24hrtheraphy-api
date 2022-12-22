"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDto = void 0;
const lodash_1 = require("lodash");
class MessageDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id', 'conversationId', 'type', 'fileId', 'imageUrl',
            'text', 'senderId', 'meta', 'createdAt', 'updatedAt', 'senderInfo', 'senderSource'
        ]));
    }
}
exports.MessageDto = MessageDto;
//# sourceMappingURL=message.dto.js.map