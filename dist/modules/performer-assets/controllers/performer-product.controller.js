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
exports.PerformerProductController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const product_service_1 = require("../services/product.service");
const payloads_1 = require("../payloads");
const product_search_service_1 = require("../services/product-search.service");
let PerformerProductController = class PerformerProductController {
    constructor(productService, productSearchService) {
        this.productService = productService;
        this.productSearchService = productSearchService;
    }
    async create(files, payload, creator) {
        const resp = await this.productService.create(payload, files.digitalFile, files.image, creator);
        return kernel_1.DataResponse.ok(resp);
    }
    async update(id, files, payload, updater) {
        const resp = await this.productService.update(id, payload, files.digitalFile, files.image, updater);
        return kernel_1.DataResponse.ok(resp);
    }
    async delete(id) {
        const resp = await this.productService.delete(id);
        return kernel_1.DataResponse.ok(resp);
    }
    async details(id, request) {
        const resp = await this.productService.performerGetDetails(id, request.jwToken);
        return kernel_1.DataResponse.ok(resp);
    }
    async search(req, user, request) {
        const resp = await this.productSearchService.performerSearch(req, user, request.jwToken);
        return kernel_1.DataResponse.ok(resp);
    }
    async userSearch(req) {
        const resp = await this.productSearchService.userSearch(req);
        return kernel_1.DataResponse.ok(resp);
    }
};
__decorate([
    (0, common_1.Post)('/'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UseInterceptors)((0, file_1.MultiFileUploadInterceptor)([
        {
            type: 'performer-product-image',
            fieldName: 'image',
            options: {
                destination: (0, kernel_1.getConfig)('file').imageDir,
                generateThumbnail: true,
                replaceWithThumbail: true,
                thumbnailSize: (0, kernel_1.getConfig)('image').productThumbnail
            }
        },
        {
            type: 'performer-product-digital',
            fieldName: 'digitalFile',
            options: {
                destination: (0, kernel_1.getConfig)('file').digitalProductDir
            }
        }
    ])),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, file_1.FilesUploaded)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.ProductCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerProductController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, common_1.UseInterceptors)((0, file_1.MultiFileUploadInterceptor)([
        {
            type: 'performer-product-image',
            fieldName: 'image',
            options: {
                destination: (0, kernel_1.getConfig)('file').imageDir,
                generateThumbnail: true,
                replaceWithThumbail: true,
                thumbnailSize: (0, kernel_1.getConfig)('image').productThumbnail
            }
        },
        {
            type: 'performer-product-digital',
            fieldName: 'digitalFile',
            options: {
                destination: (0, kernel_1.getConfig)('file').digitalProductDir
            }
        }
    ])),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, file_1.FilesUploaded)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, payloads_1.ProductCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformerProductController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('/:id/view'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PerformerProductController.prototype, "details", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Roles)('performer'),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, decorators_1.CurrentUser)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ProductSearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerProductController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('/user-search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ProductSearchRequest]),
    __metadata("design:returntype", Promise)
], PerformerProductController.prototype, "userSearch", null);
PerformerProductController = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.Controller)('performer/performer-assets/products'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        product_search_service_1.ProductSearchService])
], PerformerProductController);
exports.PerformerProductController = PerformerProductController;
//# sourceMappingURL=performer-product.controller.js.map