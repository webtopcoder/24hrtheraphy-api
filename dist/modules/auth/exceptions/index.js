"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./email-password-incorrect.exception"), exports);
__exportStar(require("./username-password-incorrect.exception"), exports);
__exportStar(require("./auth-error.exception"), exports);
__exportStar(require("./account-existed.exception"), exports);
__exportStar(require("./account-not-found.exception"), exports);
__exportStar(require("./email-not-verified"), exports);
__exportStar(require("./account-inactive.exception"), exports);
__exportStar(require("./document-missing.exception"), exports);
__exportStar(require("./password-incorrect.exception"), exports);
__exportStar(require("./account-pending.exception"), exports);
//# sourceMappingURL=index.js.map