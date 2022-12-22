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
exports.StockProductListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../purchased-item/constants");
const constants_2 = require("../../../kernel/constants");
const constants_3 = require("../../purchased-item/constants");
const services_1 = require("../services");
const constants_4 = require("../constants");
const UPDATE_STOCK_CHANNEL = 'UPDATE_STOCK_CHANNEL';
let StockProductListener = class StockProductListener {
    constructor(queueEventService, productService) {
        this.queueEventService = queueEventService;
        this.productService = productService;
        this.queueEventService.subscribe(constants_1.PURCHASED_ITEM_SUCCESS_CHANNEL, UPDATE_STOCK_CHANNEL, this.handleStockProducts.bind(this));
    }
    async handleStockProducts(event) {
        const transaction = event.data;
        if (![constants_2.EVENT.CREATED].includes(event.eventName) || (transaction === null || transaction === void 0 ? void 0 : transaction.type) !== constants_3.PURCHASE_ITEM_TYPE.PRODUCT) {
            return;
        }
        const product = await this.productService.findById(transaction.targetId);
        if ((product === null || product === void 0 ? void 0 : product.type) !== constants_4.PRODUCT_TYPE.PHYSICAL)
            return;
        await this.productService.updateStock(transaction.targetId, -1);
    }
};
StockProductListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.ProductService])
], StockProductListener);
exports.StockProductListener = StockProductListener;
//# sourceMappingURL=stock-product.listener.js.map