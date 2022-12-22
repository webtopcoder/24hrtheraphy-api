import { QueueEventService, QueueEvent } from 'src/kernel';
import { ProductService } from '../services';
export declare class StockProductListener {
    private readonly queueEventService;
    private readonly productService;
    constructor(queueEventService: QueueEventService, productService: ProductService);
    handleStockProducts(event: QueueEvent): Promise<void>;
}
