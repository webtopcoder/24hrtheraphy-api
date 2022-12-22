import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class EarningSearchRequestPayload extends SearchRequest {
    performerType: string;
    performerId: string;
    sourceId: string;
    targetId: string;
    studioId: string;
    type: string;
    source: string;
    target: string;
    fromDate: Date;
    toDate: Date;
    paidAt: Date;
    isPaid: boolean;
    payoutStatus: string;
}
export interface UpdateEarningStatusPayload {
    targetId: ObjectId;
    fromDate: Date;
    toDate: Date;
}
