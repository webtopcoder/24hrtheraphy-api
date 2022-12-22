import { SearchRequest } from 'src/kernel/common';
export declare class PerformerSearchPayload extends SearchRequest {
    type: string;
    name: string;
    q: string;
    gender: string;
    status: string;
    country: string;
    category: string;
    tags: string;
    studioId: string;
    isOnline: boolean;
    excludedId: string;
    performerType: string;
}
