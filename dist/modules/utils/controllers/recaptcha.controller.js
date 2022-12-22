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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecaptchaController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
let RecaptchaController = class RecaptchaController {
    constructor(recaptchaService) {
        this.recaptchaService = recaptchaService;
    }
    async create(payload, req) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ipClient = Array.isArray(ipClient) ? ipClient.toString() : ipClient;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const data = await this.recaptchaService.verifyGoogleRecaptcha(payload.token, ipClient);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    (0, common_1.Post)('verify'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RecaptchaController.prototype, "create", null);
RecaptchaController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('re-captcha'),
    __metadata("design:paramtypes", [services_1.RecaptchaService])
], RecaptchaController);
exports.RecaptchaController = RecaptchaController;
//# sourceMappingURL=recaptcha.controller.js.map