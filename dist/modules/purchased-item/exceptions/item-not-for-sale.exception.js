"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemNotForSaleException = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
class ItemNotForSaleException extends common_1.HttpException {
    constructor() {
        super(constants_1.ITEM_NOT_FOR_SALE, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ItemNotForSaleException = ItemNotForSaleException;
//# sourceMappingURL=item-not-for-sale.exception.js.map