"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EarningDto = void 0;
const lodash_1 = require("lodash");
class EarningDto {
    constructor(data) {
        Object.assign(this, (0, lodash_1.pick)(data, [
            '_id',
            'userId',
            'userInfo',
            'transactionTokenId',
            'transactionInfo',
            'performerId',
            'performerInfo',
            'sourceType',
            'originalPrice',
            'grossPrice',
            'netPrice',
            'isPaid',
            'commission',
            'createdAt',
            'updatedAt',
            'paidAt',
            'transactionStatus',
            'sourceId',
            'targetId',
            'source',
            'target',
            'type',
            'sourceInfo',
            'targetInfo',
            'conversionRate',
            'price',
            'payoutStatus',
            'studioToModel'
        ]));
    }
    toResponse(includePrivate = false) {
        const publicInfo = {
            _id: this._id,
            userId: this.userId,
            userInfo: this.userInfo,
            transactionTokenId: this.transactionTokenId,
            transactionInfo: this.transactionInfo,
            performerId: this.performerId,
            performerInfo: this.performerInfo,
            sourceType: this.sourceType,
            originalPrice: this.originalPrice,
            grossPrice: this.grossPrice,
            netPrice: this.netPrice,
            isPaid: this.isPaid,
            commission: this.commission,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            paidAt: this.paidAt,
            transactionStatus: this.transactionStatus,
            sourceId: this.sourceId,
            targetId: this.targetId,
            source: this.source,
            target: this.target,
            type: this.type,
            sourceInfo: this.sourceInfo,
            targetInfo: this.targetInfo,
            price: this.price,
            conversionRate: this.conversionRate,
            payoutStatus: this.payoutStatus,
            studioToModel: this.studioToModel
        };
        if (!includePrivate) {
            return publicInfo;
        }
        return Object.assign({}, publicInfo);
    }
}
exports.EarningDto = EarningDto;
//# sourceMappingURL=earning.dto.js.map