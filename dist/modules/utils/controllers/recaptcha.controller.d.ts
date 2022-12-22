import { DataResponse } from 'src/kernel';
import { Request as Req } from 'express';
import { RecaptchaService } from '../services';
export declare class RecaptchaController {
    private readonly recaptchaService;
    constructor(recaptchaService: RecaptchaService);
    create(payload: {
        token: string;
    }, req: Req): Promise<DataResponse<any>>;
}
