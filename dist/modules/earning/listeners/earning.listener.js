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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEarningListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../purchased-item/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const settings_1 = require("../../settings");
const dtos_1 = require("../../purchased-item/dtos");
const services_2 = require("../../studio/services");
const constants_3 = require("../../payment/constants");
const constants_4 = require("../../settings/constants");
const earning_provider_1 = require("../providers/earning.provider");
const constants_5 = require("../constants");
const PURCHASED_ITEM_SUCCESS = 'PURCHASED_ITEM_SUCCESS';
const UPDATED_EARNING_PAID_STATUS = 'UPDATED_EARNING_PAID_STATUS';
let TransactionEarningListener = class TransactionEarningListener {
    constructor(earningModel, queueEventService, performerService, studioService, settingService, performerCommission) {
        this.earningModel = earningModel;
        this.queueEventService = queueEventService;
        this.performerService = performerService;
        this.studioService = studioService;
        this.settingService = settingService;
        this.performerCommission = performerCommission;
        this.queueEventService.subscribe(constants_1.PURCHASED_ITEM_SUCCESS_CHANNEL, PURCHASED_ITEM_SUCCESS, this.handleListenEarning.bind(this));
        this.queueEventService.subscribe(constants_5.EARNING_CHANNEL, UPDATED_EARNING_PAID_STATUS, this.caclBalance.bind(this));
    }
    async handleListenEarning(event) {
        try {
            const transaction = event.data;
            if (event.eventName !== constants_2.EVENT.CREATED ||
                (transaction === null || transaction === void 0 ? void 0 : transaction.status) !== constants_3.PAYMENT_STATUS.SUCCESS) {
                return;
            }
            const performerId = transaction.sellerId;
            const performer = await this.performerService.findById(performerId);
            if (!performer) {
                return;
            }
            let commission = 0;
            let studioCommision = 0;
            let studioEarning = null;
            const [defaultPerformerCommission, defaultStudioCommission, performerCommission, conversionRate] = await Promise.all([
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.PERFORMER_COMMISSION),
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.STUDIO_COMMISSION),
                this.performerCommission.findOne({ performerId: performer._id }),
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.CONVERSION_RATE)
            ]);
            if (performer.studioId) {
                const studio = await this.studioService.findById(performer.studioId);
                studioCommision = studio.commission || defaultStudioCommission;
                commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                switch (transaction.type) {
                    case constants_1.PURCHASE_ITEM_TYPE.GROUP:
                        studioCommision = studio.groupCallCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.groupCallCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PRIVATE:
                        studioCommision = studio.privateCallCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.privateCallCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.TIP:
                        studioCommision = studio.tipCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.tipCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PRODUCT:
                        studioCommision = studio.productCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.productCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PHOTO:
                        studioCommision = studio.albumCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.albumCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.SALE_VIDEO:
                        studioCommision = studio.videoCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.videoCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    default:
                        break;
                }
                const newStudioEarning = {
                    conversionRate: conversionRate || parseInt(process.env.CONVERSION_RATE, 10),
                    originalPrice: transaction.totalPrice,
                    grossPrice: transaction.totalPrice,
                    commission: studioCommision,
                    netPrice: transaction.totalPrice * (studioCommision / 100),
                    performerId: transaction.sellerId,
                    userId: transaction.sourceId,
                    transactionTokenId: transaction._id,
                    type: transaction.type,
                    createdAt: transaction.createdAt,
                    transactionStatus: transaction.status,
                    sourceId: transaction.sellerId,
                    source: constants_2.ROLE.PERFORMER,
                    target: constants_2.ROLE.STUDIO,
                    targetId: performer.studioId
                };
                studioEarning = await this.earningModel.create(newStudioEarning);
            }
            else if (performerCommission) {
                switch (transaction.type) {
                    case constants_1.PURCHASE_ITEM_TYPE.GROUP:
                        commission = performerCommission.groupCallCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PRIVATE:
                        commission = performerCommission.privateCallCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.TIP:
                        commission = performerCommission.tipCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PRODUCT:
                        commission = performerCommission.productCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PHOTO:
                        commission = performerCommission.albumCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.SALE_VIDEO:
                        commission = performerCommission.videoCommission;
                        break;
                    default:
                        break;
                }
            }
            else {
                commission = defaultPerformerCommission;
            }
            const grossPrice = performer.studioId
                ? transaction.totalPrice * (studioCommision / 100)
                : transaction.totalPrice;
            const netPrice = grossPrice * (commission / 100);
            const newEarning = new this.earningModel();
            newEarning.set('conversionRate', conversionRate || parseInt(process.env.CONVERSION_RATE, 10));
            newEarning.set('originalPrice', transaction.totalPrice);
            newEarning.set('grossPrice', grossPrice);
            newEarning.set('commission', commission);
            newEarning.set('netPrice', netPrice);
            newEarning.set('performerId', transaction.sellerId);
            newEarning.set('userId', transaction.sourceId);
            newEarning.set('transactionTokenId', transaction._id);
            newEarning.set('type', transaction.type);
            newEarning.set('createdAt', transaction.createdAt);
            newEarning.set('transactionStatus', transaction.status);
            newEarning.set('sourceId', transaction.sourceId);
            newEarning.set('targetId', transaction.sellerId);
            newEarning.set('source', constants_2.ROLE.USER);
            newEarning.set('target', constants_2.ROLE.PERFORMER);
            if (studioEarning) {
                newEarning.set('studioToModel', {
                    grossPrice,
                    commission,
                    netPrice
                });
            }
            const modelEarning = await newEarning.save();
            if (studioEarning) {
                await this.earningModel.updateOne({ _id: studioEarning._id }, {
                    studioToModel: {
                        grossPrice,
                        commission,
                        netPrice,
                        payoutStatus: 'pending',
                        refItemId: modelEarning._id
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async caclBalance(event) {
        try {
            const { eventName, data } = event;
            if (eventName !== constants_2.EVENT.UPDATED) {
                return;
            }
            const { targetId } = data;
            const [performer, studio] = await Promise.all([
                this.performerService.findOne({ _id: targetId }),
                this.studioService.findById(targetId)
            ]);
            if (!performer && !studio)
                return;
            const result = await this.earningModel.aggregate([
                {
                    $match: {
                        targetId: (performer === null || performer === void 0 ? void 0 : performer._id) || (studio === null || studio === void 0 ? void 0 : studio._id),
                        isPaid: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ]);
            const balance = (result.length && typeof result[0].total !== 'undefined') ? result[0].total : 0;
            if (performer)
                await this.performerService.updateBalance(performer._id, balance);
            if (studio)
                await this.studioService.updateBalance(studio._id, balance);
        }
        catch (e) {
            console.log(e);
        }
    }
};
TransactionEarningListener = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.PerformerService,
        services_2.StudioService,
        settings_1.SettingService,
        services_1.PerformerCommissionService])
], TransactionEarningListener);
exports.TransactionEarningListener = TransactionEarningListener;
//# sourceMappingURL=earning.listener.js.map