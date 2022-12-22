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
exports.PaymentTokenListener = void 0;
const kernel_1 = require("../../../kernel");
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const constants_1 = require("../../../kernel/constants");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_3 = require("../../settings/services");
const constants_2 = require("../../message/constants");
const constants_3 = require("../../settings/constants");
const services_4 = require("../../studio/services");
const services_5 = require("../../message/services");
const dtos_1 = require("../../user/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const constants_4 = require("../constants");
const HANDLE_PAYMENT_TOKEN = 'HANDLE_PAYMENT_TOKEN';
const RECEIVED_PAID_TOKEN = 'RECEIVED_PAID_TOKEN';
let PaymentTokenListener = class PaymentTokenListener {
    constructor(userService, performerService, queueEventService, socketUserService, settingService, performerCommission, studioService, conversationService) {
        this.userService = userService;
        this.performerService = performerService;
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.settingService = settingService;
        this.performerCommission = performerCommission;
        this.studioService = studioService;
        this.conversationService = conversationService;
        this.queueEventService.subscribe(constants_4.PURCHASED_ITEM_SUCCESS_CHANNEL, HANDLE_PAYMENT_TOKEN, this.handler.bind(this));
    }
    async handler(event) {
        const { eventName } = event;
        const transaction = event.data;
        const { sourceId, source, status, totalPrice } = transaction;
        const performerId = transaction.sellerId;
        try {
            if (eventName !== constants_1.EVENT.CREATED ||
                status !== constants_4.PURCHASE_ITEM_STATUS.SUCCESS) {
                return;
            }
            const [owner, performer] = await Promise.all([
                this.getUser(source, sourceId),
                performerId ? await this.performerService.findById(performerId) : null
            ]);
            if (!owner || !performer)
                return;
            let commission = 0;
            let studioCommision = 0;
            const [defaultPerformerCommission, defaultStudioCommission, performerCommission] = await Promise.all([
                this.settingService.getKeyValue(constants_3.SETTING_KEYS.PERFORMER_COMMISSION),
                this.settingService.getKeyValue(constants_3.SETTING_KEYS.STUDIO_COMMISSION),
                this.performerCommission.findOne({ performerId: performer._id }),
                this.settingService.getKeyValue(constants_3.SETTING_KEYS.CONVERSION_RATE)
            ]);
            if (performer.studioId) {
                const studio = await this.studioService.findById(performer.studioId);
                studioCommision = studio.commission || defaultStudioCommission;
                commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                switch (transaction.type) {
                    case constants_4.PURCHASE_ITEM_TYPE.GROUP:
                        studioCommision = studio.groupCallCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.groupCallCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.PRIVATE:
                        studioCommision = studio.privateCallCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.privateCallCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.TIP:
                        studioCommision = studio.tipCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.tipCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.PRODUCT:
                        studioCommision = studio.productCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.productCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.PHOTO:
                        studioCommision = studio.albumCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.albumCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.SALE_VIDEO:
                        studioCommision = studio.videoCommission || defaultStudioCommission;
                        commission = (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.videoCommission) || (performerCommission === null || performerCommission === void 0 ? void 0 : performerCommission.memberCommission) || defaultPerformerCommission;
                        break;
                    default:
                        break;
                }
            }
            else if (performerCommission) {
                switch (transaction.type) {
                    case constants_4.PURCHASE_ITEM_TYPE.GROUP:
                        commission = performerCommission.groupCallCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.PRIVATE:
                        commission = performerCommission.privateCallCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.TIP:
                        commission = performerCommission.tipCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.PRODUCT:
                        commission = performerCommission.productCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.PHOTO:
                        commission = performerCommission.albumCommission;
                        break;
                    case constants_4.PURCHASE_ITEM_TYPE.SALE_VIDEO:
                        commission = performerCommission.videoCommission;
                        break;
                    default:
                        break;
                }
            }
            else {
                commission = defaultPerformerCommission;
            }
            const grossPrice = performer.studioId ? totalPrice * (studioCommision / 100) : totalPrice;
            const netPrice = grossPrice * (commission / 100);
            await Promise.all([
                this.performerService.increaseBalance(performer._id, netPrice),
                performer.studioId &&
                    this.studioService.increaseBalance(performer.studioId, (totalPrice * studioCommision) / 100),
                source === constants_1.ROLE.USER
                    ? this.userService.increaseBalance(transaction.sourceId, totalPrice * -1)
                    : this.performerService.increaseBalance(transaction.sourceId, totalPrice * -1)
            ]);
            await this.notify(transaction, netPrice);
        }
        catch (err) {
            console.log(err);
        }
    }
    async notify(transaction, netPrice) {
        try {
            const { targetId, sourceId, type, totalPrice } = transaction;
            const performerId = transaction.sellerId;
            if (type === constants_4.PURCHASE_ITEM_TYPE.TIP) {
                const [user, conversation] = await Promise.all([
                    this.userService.findById(sourceId),
                    targetId && this.conversationService.findById(targetId)
                ]);
                const senderInfo = user && new dtos_1.UserDto(user).toResponse();
                const message = {
                    conversationId: conversation._id,
                    _id: (0, string_helper_1.generateUuid)(),
                    senderInfo,
                    token: totalPrice,
                    text: `has tipped ${totalPrice} tokens`,
                    type: constants_2.MESSAGE_TYPE.TIP
                };
                await Promise.all([
                    conversation &&
                        this.socketUserService.emitToRoom(this.conversationService.serializeConversation(conversation._id, conversation.type), `message_created_conversation_${conversation._id}`, message),
                    this.socketUserService.emitToUsers(performerId, 'tipped', {
                        senderInfo,
                        token: totalPrice, netPrice
                    })
                ]);
            }
            if ([constants_4.PURCHASE_ITEM_TYPE.GROUP, constants_4.PURCHASE_ITEM_TYPE.PRIVATE].includes(type)) {
                this.socketUserService.emitToUsers(performerId, RECEIVED_PAID_TOKEN, {
                    conversationId: targetId,
                    token: totalPrice, netPrice
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async getUser(role, id) {
        if (!role || !id)
            return null;
        let user = null;
        if (role === constants_1.ROLE.USER) {
            user = await this.userService.findById(id);
        }
        else if (role === constants_1.ROLE.PERFORMER) {
            user = await this.performerService.findById(id);
        }
        return user;
    }
};
PaymentTokenListener = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [services_1.UserService,
        services_2.PerformerService,
        kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        services_3.SettingService,
        services_2.PerformerCommissionService,
        services_4.StudioService,
        services_5.ConversationService])
], PaymentTokenListener);
exports.PaymentTokenListener = PaymentTokenListener;
//# sourceMappingURL=payment-token.listener.js.map