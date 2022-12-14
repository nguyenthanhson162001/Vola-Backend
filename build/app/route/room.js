"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RoomController_1 = __importDefault(require("../controllers/RoomController"));
const cloudinary_1 = __importDefault(require("..//..//infrastructure/cloudinary"));
const router = (0, express_1.Router)();
router.get("/users/:userId", RoomController_1.default.getPrivateRoomByUser);
router.get("/", RoomController_1.default.getMyRooms);
router.post("/", cloudinary_1.default.single("avatar"), RoomController_1.default.createGroupRoomByUser);
router.get("/search", RoomController_1.default.searchRoom);
router.get("/:roomId/messages", RoomController_1.default.getMesageByGroup);
router.put("/:roomId/users", RoomController_1.default.addUserIntoRoom);
router.patch("/:roomId/name", RoomController_1.default.updateNameRoom);
router.patch("/:roomId/avatar", cloudinary_1.default.single("avatar"), RoomController_1.default.updateAvatarRoom);
router.delete("/:roomId/users/:userId", RoomController_1.default.removeUserFromRoom);
router.put("/:roomId", cloudinary_1.default.single("avatar"), RoomController_1.default.createGroupRoomByUser);
router.get("/:roomId", RoomController_1.default.getRoomById);
router.get("/:roomId/user-vailable-add-room", RoomController_1.default.getListUserAvailableAddRoom);
router.delete("/:roomId", RoomController_1.default.deleteRoom);
router.patch("/:roomId/owner", RoomController_1.default.changeOwner);
router.post("/:roomId/read", RoomController_1.default.readMessageInRoom);
router.delete("/:roomId/messages/:messageId", RoomController_1.default.deleteMessage);
router.post("/:roomId/messages/:messageId/react", RoomController_1.default.reactMessage);
// router.get(
//   "/:roomId/messages/:messageId/react",
//   RoomController.getReHtactMessage
// );
exports.default = router;
