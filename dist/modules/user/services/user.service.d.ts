import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { FileDto } from 'src/modules/file';
import { PageableData } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { SettingService } from 'src/modules/settings';
import { AuthService } from 'src/modules/auth/services';
import { UserModel, ShippingInfoModel } from '../models';
import { UserUpdatePayload, UserAuthUpdatePayload, UserAuthCreatePayload, UserCreatePayload } from '../payloads';
import { UserDto, IShippingInfo, IShippingInfoResponse } from '../dtos';
export declare class UserService {
    private readonly userModel;
    private readonly shippingInfoModel;
    private readonly fileService;
    private readonly settingService;
    private readonly authService;
    constructor(userModel: Model<UserModel>, shippingInfoModel: Model<ShippingInfoModel>, fileService: FileService, settingService: SettingService, authService: AuthService);
    find(params: any): Promise<UserModel[]>;
    findByEmail(email: string): Promise<UserModel | null>;
    findByEmails(emails: string[]): Promise<UserModel[]>;
    findById(id: string | ObjectId): Promise<UserModel>;
    findByUsername(username: string): Promise<UserDto>;
    findByIds(ids: any[]): Promise<UserDto[]>;
    create(data: Partial<UserCreatePayload> | UserAuthCreatePayload, options?: any): Promise<UserModel>;
    update(id: string | ObjectId, payload: Partial<UserUpdatePayload>, user?: UserDto): Promise<any>;
    updateAvatar(user: UserDto, file: FileDto): Promise<FileDto>;
    adminUpdate(id: string | ObjectId, payload: UserAuthUpdatePayload): Promise<any>;
    createShippingInfo(user: UserDto, data: IShippingInfo): Promise<ShippingInfoModel>;
    getShippingInfo(id: string | ObjectId): Promise<PageableData<IShippingInfoResponse>>;
    updateVerificationStatus(userId: string | ObjectId): Promise<any>;
    increaseBalance(id: string | ObjectId, amount: number, withStats?: boolean): Promise<import("mongoose").UpdateWriteOpResult>;
    updateStats(id: string | ObjectId, payload: Record<string, number>): Promise<import("mongoose").UpdateWriteOpResult>;
    stats(): Promise<{
        totalViewTime: any;
        totalTokenSpent: any;
    }>;
}
