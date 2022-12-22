"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecaptchaService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const ERROR_CODE = {
    'missing-input-secret': 'The secret parameter is missing.',
    'invalid-input-secret': 'The secret parameter is invalid or malformed.',
    'missing-input-response': 'The response parameter is missing.',
    'invalid-input-response': 'The response parameter is invalid or malformed.',
    'bad-request': 'The request is invalid or malformed..',
    'timeout-or-duplicate': 'The response is no longer valid: either is too old or has been used previously.'
};
let RecaptchaService = class RecaptchaService {
    constructor() { }
    async verifyGoogleRecaptcha(token, remoteip) {
        try {
            const googleReCaptchaSecretKey = await settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.GOOGLE_RECAPTCHA_SECRET_KEY);
            if (!googleReCaptchaSecretKey) {
                throw new common_1.HttpException({
                    'error-codes': ['missing-input-secret']
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const resp = await axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${googleReCaptchaSecretKey}&response=${token}&remoteip=${remoteip}`);
            if (resp.data.success) {
                return Object.assign(Object.assign({}, resp.data), { remoteip });
            }
            throw new common_1.HttpException(resp.data, common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            console.log(error);
            const { response, status } = error;
            if (response && response['error-codes']) {
                throw new common_1.HttpException({
                    data: error,
                    message: response['error-codes'][0]
                        ? ERROR_CODE[response['error-codes'][0]]
                        : ERROR_CODE['bad-request']
                }, status || common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException(ERROR_CODE['bad-request'], common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
RecaptchaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RecaptchaService);
exports.RecaptchaService = RecaptchaService;
//# sourceMappingURL=re-captcha.service.js.map