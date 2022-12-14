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
const RoomRepository_1 = __importDefault(require("../../../infrastructure/mongoose/repositories/RoomRepository"));
const UserRepository_1 = __importDefault(require("../../../infrastructure/mongoose/repositories/UserRepository"));
const StringValidate_1 = __importDefault(require("../../../util/validate/StringValidate"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const handlerOutsite_1 = require("../../socket/handlerOutsite");
const Handler_1 = __importDefault(require("../Handler"));
class ChangeOwnerRoomHannler extends Handler_1.default {
    validate(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOwner = this._colectErrors.collect("userId", () => (0, StringValidate_1.default)(request.newOwner));
            const roomId = this._colectErrors.collect("roomId", () => (0, StringValidate_1.default)(request.roomId));
            if (this._colectErrors.hasError()) {
                throw new ValidationError_1.default(this._colectErrors.errors);
            }
            return { newOwner, roomId, myId: request.myId };
        });
    }
    handle(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield this.validate(request);
            const user = yield UserRepository_1.default.findOneById(input.newOwner);
            if (!user)
                throw new Error("user not found");
            const room = yield RoomRepository_1.default.changeOwnerRoom(input.newOwner, input.roomId, input.myId);
            room.users.forEach((e) => {
                (0, handlerOutsite_1.sendEventChangeOwnerRoomSocket)({ newOwner: input.newOwner, roomId: input.roomId }, e._id);
            });
            return room;
        });
    }
}
exports.default = new ChangeOwnerRoomHannler();
