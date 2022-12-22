import { Model } from 'mongoose';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerCommissionService, PerformerService } from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings';
import { StudioService } from 'src/modules/studio/services';
import { EarningModel } from '../models/earning.model';
export declare class TransactionEarningListener {
    private readonly earningModel;
    private readonly queueEventService;
    private readonly performerService;
    private readonly studioService;
    private readonly settingService;
    private readonly performerCommission;
    constructor(earningModel: Model<EarningModel>, queueEventService: QueueEventService, performerService: PerformerService, studioService: StudioService, settingService: SettingService, performerCommission: PerformerCommissionService);
    handleListenEarning(event: QueueEvent): Promise<void>;
    private caclBalance;
}
