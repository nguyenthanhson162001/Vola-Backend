import { NextFunction, Request, Response } from "express";
import GetPrivateRoomByUserHandler from "../handlers/rooms/GetPrivateRoomByUserHandler";
import CreateGroupRoomHandler from "../handlers/rooms/CreateGroupRoomHandler";
import GetMyRoomsHandler from "../handlers/rooms/GetMyRoomsHandler";
import { IMessage } from "../entities/Room";
import GetMessagesHandler from "../handlers/rooms/GetMessagesHandler";
import AddUserIntoRoomHannler from "../handlers/rooms/AddUserIntoRoomHannler";
import SearchRoomHandler from "../handlers/rooms/SearchRoomHandler";

class RoomController {
  // [GET] api/rooms/users/:userId
  async getPrivateRoomByUser(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
      userId: req.params.userId,
    };
    const result = await GetPrivateRoomByUserHandler.handle(request);
    res.status(200).json(result);
  }
  // [POST] api/rooms
  async createGroupRoomByUser(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
      userIds: req.body.userIds,
      name: req.body.name,
      avatar: req.body.avatar,
    };
    const result = await CreateGroupRoomHandler.handle(request);
    res.status(200).json(result);
  }
  // [PUT] api/rooms
  async addUserIntoRoom(req: Request, res: Response, next: NextFunction) {
    const request = {
      userId: req.params.userId,
      roomId: req.params.roomId,
    };
    const result = await AddUserIntoRoomHannler.handle(request);
    res.status(200).json(result);
  }
  // [GET] api/rooms
  async getMyRooms(req: Request, res: Response, next: NextFunction) {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      userId: req.headers.userId as string,
    };
    const result = await GetMyRoomsHandler.handle(request);
    res.status(200).json(result);
  }
  // [GET] api/rooms/messages
  async getMesageByGroup(req: Request, res: Response, next: NextFunction) {
    const request = {
      limit: Number(req.query.limit),
      page: Number(req.query.page),
      roomId: req.params.roomId as string,
      type: req.query.type as string,
    };
    const result = await GetMessagesHandler.handle(request);
    res.status(200).json(result);
  }
  // [GET] api/rooms/search?q=
  async searchRoom(req: Request, res: Response, next: NextFunction) {
    const request = {
      myId: req.headers.userId as string,
      q: req.query.q as string,
    };
    const result = await SearchRoomHandler.handle(request);
    res.status(200).json(result);
  }
}
export default new RoomController();
