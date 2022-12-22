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
exports.PerformerGalleryController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const gallery_service_1 = require("../services/gallery.service");
const gallery_update_payload_1 = require("../payloads/gallery-update.payload");
let PerformerGalleryController = class PerformerGalleryController {
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    async createGallery(payload, creator) {
        const resp = await this.galleryService.create(payload, creator);
        return kernel_1.DataResponse.ok(resp);
    }
    async updateGallery(id, payload, creator) {
        const resp = await this.galleryService.update(id, payload, creator);
        return kernel_1.DataResponse.ok(resp);
    }
    async searchGallery(req, user, request) {
        const resp = await this.galleryService.performerSearch(req, user, request.jwToken);
        return kernel_1.DataResponse.ok(resp);
    }
    async view(id, user) {
        const resp = await this.galleryService.details(id, user);
        return kernel_1.DataResponse.ok(resp);
    }
    async delete(id) {
        const details = await this.galleryService.delete(id);
        return kernel_1.DataResponse.ok(details);
    }
};
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.GalleryCreatePayload, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerGalleryController.prototype, "createGallery", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gallery_update_payload_1.GalleryUpdatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerGalleryController.prototype, "updateGallery", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.GallerySearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerGalleryController.prototype, "searchGallery", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerGalleryController.prototype, "view", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformerGalleryController.prototype, "delete", null);
PerformerGalleryController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performer/performer-assets/galleries'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], PerformerGalleryController);
exports.PerformerGalleryController = PerformerGalleryController;
//# sourceMappingURL=performer-gallery.controller.js.map