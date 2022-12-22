import { Model } from 'mongoose';
import { PageableData, QueueEventService } from 'src/kernel';
import { StudioService } from 'src/modules/studio/services';
import { ObjectId } from 'mongodb';
import { EarningModel } from '../models/earning.model';
import { EarningSearchRequestPayload, UpdateEarningStatusPayload } from '../payloads';
import { UserDto } from '../../user/dtos';
import { UserService } from '../../user/services';
import { PerformerService } from '../../performer/services';
import { EarningDto, IEarning, IEarningStatResponse } from '../dtos/earning.dto';
import { PerformerDto } from '../../performer/dtos';
import { PurchaseItemService } from '../../purchased-item/services';
export declare class EarningService {
    private readonly earningModel;
    private readonly userService;
    private readonly performerService;
    private readonly studioService;
    private readonly paymentService;
    private readonly queueEventService;
    constructor(earningModel: Model<EarningModel>, userService: UserService, performerService: PerformerService, studioService: StudioService, paymentService: PurchaseItemService, queueEventService: QueueEventService);
    search(req: EarningSearchRequestPayload, user?: UserDto): Promise<PageableData<IEarning>>;
    getInfo(id: string | ObjectId, role: string): Promise<PerformerDto | import("../../user/models").UserModel | import("../../studio/dtos").StudioDto>;
    details(id: string): Promise<EarningDto>;
    adminStats(req: EarningSearchRequestPayload): Promise<IEarningStatResponse>;
    stats(req: EarningSearchRequestPayload, options?: any): Promise<IEarningStatResponse>;
    calculatePayoutRequestStats(q: any): Promise<{
        totalPrice: any;
        paidPrice: any;
        remainingPrice: any;
    }>;
    updatePaidStatus(payload: UpdateEarningStatusPayload): Promise<any>;
    updateRejectStatus(payload: UpdateEarningStatusPayload): Promise<any>;
    updateRefItemsStudioToModel(request: any, status: any): Promise<void>;
    getTotalPendingToken(performerId: string | ObjectId): Promise<{
        total: any;
    }>;
}
