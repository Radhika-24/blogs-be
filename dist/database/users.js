"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const schema = mongoose_1.default.Schema;
const userSchema = new schema({
    name: { type: String },
    username: { type: String },
    plan: { type: String },
    userId: { type: String },
    dailyReadQuota: { type: Number },
});
userSchema.plugin(passport_local_mongoose_1.default);
exports.users = mongoose_1.default.model("users", userSchema);
//# sourceMappingURL=users.js.map