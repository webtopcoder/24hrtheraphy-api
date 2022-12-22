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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const settings_1 = require("../../settings");
const mailer_service_1 = require("../../mailer/services/mailer.service");
const constants_1 = require("../../settings/constants");
let ContactService = class ContactService {
    constructor(mailService) {
        this.mailService = mailService;
    }
    async contact(data) {
        const adminEmail = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.ADMIN_EMAIL) || `admin@${process.env.DOMAIN}`;
        await this.mailService.send({
            subject: 'New contact',
            to: adminEmail,
            data,
            template: 'contact'
        });
        return true;
    }
};
ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_service_1.MailerService])
], ContactService);
exports.ContactService = ContactService;
//# sourceMappingURL=contact.service.js.map