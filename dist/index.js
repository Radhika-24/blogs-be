"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const node_cron_1 = __importDefault(require("node-cron"));
const cors_1 = __importDefault(require("cors"));
const contants_1 = require("./contants");
const userRouter_1 = require("./Routers/userRouter");
const express_session_1 = __importDefault(require("express-session"));
const blogsRouter_1 = require("./Routers/blogsRouter");
const users_1 = require("./database/users");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Setup mongoose connection
mongoose_1.default.connect(contants_1.MONGO_URL);
// Set up middleware for parsing JSON and URL-encoded bodies
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({ secret: contants_1.SECRET_KEY }));
app.use("/blogs", blogsRouter_1.blogsRouter);
app.use("/", userRouter_1.userRouter);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
// reset daily raedy quota for STARTER plan customers
node_cron_1.default.schedule("0 0 0 * * * *", (req, res) => {
    const u = users_1.users.updateMany({ plan: contants_1.PLANS.STARTER }, { dailyReadQuota: contants_1.STARTER_PLAN_QUOTA });
});
//# sourceMappingURL=index.js.map