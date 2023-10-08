"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const blogsSchema = new schema({
    title: { type: String },
    content: { type: String },
    publishedBy: { type: String },
});
exports.blogs = mongoose_1.default.model("blogs", blogsSchema);
//# sourceMappingURL=blogs.js.map