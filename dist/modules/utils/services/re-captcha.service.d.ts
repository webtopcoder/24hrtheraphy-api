export declare class RecaptchaService {
    constructor();
    verifyGoogleRecaptcha(token: string, remoteip: string): Promise<any>;
}
