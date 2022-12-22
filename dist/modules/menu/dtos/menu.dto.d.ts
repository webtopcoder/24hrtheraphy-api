import { ObjectId } from 'mongodb';
export interface IMenuResponse {
    _id?: ObjectId;
    title?: string;
    path?: string;
    internal?: boolean;
    parentId?: string;
    help?: string;
    section?: string;
    public?: boolean;
    ordering?: number;
    isOpenNewTab?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class MenuDto {
    _id?: ObjectId;
    title?: string;
    path?: string;
    internal?: boolean;
    parentId?: string;
    help?: string;
    section?: string;
    public?: boolean;
    ordering?: number;
    isOpenNewTab?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<MenuDto>);
}
