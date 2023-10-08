"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = __importDefault(require("express"));
const users_1 = require("../database/users");
const authenticate_1 = require("../authenticate");
const contants_1 = require("../contants");
const blogs_1 = require("../database/blogs");
exports.blogsRouter = express_1.default.Router();
exports.blogsRouter
    .route("/")
    .get(authenticate_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = req.body.page || 1;
        const user = yield users_1.users.findOne({ _id: req.user._id });
        if (user.plan === contants_1.PLANS.PROFESSIONAL) {
            res.json(yield blogs_1.blogs
                .find()
                .skip((page - 1) * contants_1.PAGE_LENGTH)
                .limit(contants_1.PAGE_LENGTH));
        }
        else if (user.plan === contants_1.PLANS.STARTER && page === 1) {
            res.json(yield blogs_1.blogs.find().limit(contants_1.PAGE_LENGTH));
        }
        else {
            res.statusCode = 403;
            res.statusMessage = "Forbidden";
            res.send();
        }
    }
    catch (err) {
        res.statusCode = 500;
        res.statusMessage = "Something went wrong";
        res.send();
    }
}))
    .post(authenticate_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const user = yield users_1.users.findOne({ _id: req.user._id });
        if (user.plan === contants_1.PLANS.FREE) {
            res.statusCode = 403;
            res.statusMessage = "Forbidden";
            res.send();
        }
        else {
            const newBlog = yield blogs_1.blogs.create({
                title,
                content,
                publishedBy: req.user._id,
            });
            if (newBlog) {
                res.statusCode = 200;
                res.statusMessage = "Blog published";
                res.json({ message: "published" });
            }
            else {
                res.statusCode = 500;
                res.statusMessage = "Something went wrong";
                res.send();
            }
        }
    }
    catch (err) {
        res.statusCode = 500;
        res.statusMessage = "Something went wrong";
        res.send();
    }
}));
exports.blogsRouter.route("/:id").get(authenticate_1.verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.users.findOne({ _id: req.user._id });
        if (user.plan === contants_1.PLANS.FREE) {
            res.statusCode = 403;
            res.statusMessage = "Forbidden";
            res.send();
        }
        else if (user.plan === contants_1.PLANS.PROFESSIONAL) {
            res.json(yield blogs_1.blogs.findOne({ _id: req.params.id }));
        }
        else if (user.plan === contants_1.PLANS.STARTER) {
            if (user.dailyReadQuota > 0) {
                const c = yield users_1.users.findOneAndUpdate({ _id: user._id }, { dailyReadQuota: user.dailyReadQuota - 1 });
                const blog = yield blogs_1.blogs.findOne({ _id: req.params.id });
                const publisher = yield users_1.users.findById(blog.publishedBy, { name: 1 });
                blog.publishedBy = (publisher === null || publisher === void 0 ? void 0 : publisher.name) || null;
                res.json(blog);
            }
            else {
                res.statusCode = 403;
                res.statusMessage = "Daily quota exceeded";
                res.send();
            }
        }
    }
    catch (err) {
        res.statusCode = 500;
        res.statusMessage = "Something went wrong";
        res.send();
    }
}));
//# sourceMappingURL=blogsRouter.js.map