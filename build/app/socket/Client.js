"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusClient = void 0;
const logger_1 = __importDefault(require("../../infrastructure/logger"));
const addUserHandler_1 = __importDefault(require("./handler/addUserHandler"));
const clientSendMessageHandler_1 = __importDefault(require("./handler/clientSendMessageHandler"));
const disconectHandler_1 = __importDefault(require("./handler/disconectHandler"));
var StatusClient;
(function (StatusClient) {
    StatusClient[StatusClient["Disconect"] = 0] = "Disconect";
    StatusClient[StatusClient["AsyncUser"] = 1] = "AsyncUser";
    StatusClient[StatusClient["Connect"] = 2] = "Connect";
})(StatusClient = exports.StatusClient || (exports.StatusClient = {}));
class Client {
    constructor(socket, socketMain, token) {
        this.userId = "";
        this.socket = socket;
        this.socketMain = socketMain;
        this.status = StatusClient.Connect; // default
        // add user to list users
        addUserHandler_1.default
            .bind(this)({ token, client: this })
            .catch((err) => this.error(socket, err));
        this.addlistenEvent();
    }
    addlistenEvent() {
        this.socket.on("client-send-message", this.onClientSendMessage.bind(this));
        this.socket.on("disconnect", this.onDiscornect.bind(this));
    }
    onDiscornect() {
        (0, disconectHandler_1.default)(this);
        logger_1.default.warn(`Diconnect from ${this.socket.id}`);
    }
    onClientSendMessage(data) {
        (0, clientSendMessageHandler_1.default)(data, this.socketMain);
    }
    error(socket, error) {
        logger_1.default.error("Socket error: ", error);
        socket.emit("error", error);
    }
}
exports.default = Client;
