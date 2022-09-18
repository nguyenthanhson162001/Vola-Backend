"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const handlerError_1 = __importDefault(require("../middleware/handlerError"));
const user_1 = __importDefault(require("./user"));
const router = (0, express_1.Router)();
router.use(authenticate_1.default);
// collect error
router.use("/users", user_1.default);
router.use("/error", () => {
    throw new Error("loi ne ");
});
router.use(handlerError_1.default);
exports.default = router;
