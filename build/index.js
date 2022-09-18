"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
require("dotenv/config");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./app/route"));
const port = Number(process.env.PORT || 5000);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// Security
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
}));
app.use("/api", route_1.default);
// 404
app.use("*", (req, res) => res.status(404).send("url not found"));
app.listen(port, () => {
    console.log(`Express server started on http://localhost:${port}`);
});
