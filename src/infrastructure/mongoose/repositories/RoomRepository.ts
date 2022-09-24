import {
  IMessage,
  IRoom,
  TypeMeesage,
  TypeRoom,
} from "../../../app/entities/Room";
import Repository from "./Repository";
import RoomModel from "../model/Room";
import UserModel from "../model/User";
import UserRepository from "./UserRepository";
import { IUser } from "../../../app/entities/User";
class RoomRepository extends Repository<IRoom> {
  constructor() {
    super(RoomModel as any);
  }
  async getRoomsByUser(userId: string, limit: number, offset: number) {
    const rooms = await RoomModel.find(
      { "users._id": userId },
      { __v: 0, messages: { $slice: -1 } }
    )
      .limit(limit)
      .skip(offset)
      .sort({ updatedAt: -1 })
      .exec();
    const result = rooms.map(async (room: any) => {
      // private room then add avatar and name room
      if (room.typeRoom == TypeRoom.Private) {
        // because Private room only 2 user and we find user disserent me
        const id =
          room.users[0]._id == userId ? room.users[0]._id : room.users[1]._id;
        // add avatar and different with my user
        const user = await UserRepository.findOneById(id);
        room.avatar = user?.avatar;
        room.name = user?.name;
      }
      delete room.users;
      return room;
    });
    return Promise.all(result);
  }
  async getPrivateRoomByUser(myId: string, userId: string) {
    const user = await UserRepository.findOneById(userId);
    if (!user) throw new Error("userId not found");

    var room: any = await RoomModel.findOne(
      {
        typeRoom: TypeRoom.Private,
        "users._id": {
          $all: [myId, userId],
        },
      },
      { __v: 0, messages: { $slice: -1 } }
    );

    if (!room) {
      // create new room private
      room = await this.add({
        messages: [],
        users: [{ _id: myId }, { _id: userId }],
        typeRoom: TypeRoom.Private,
      });
    }
    // add avatar and name user in room
    if (!room.avatar) room.avatar = user.avatar;
    if (!room.name) room.name = user.name;

    return room;
  }
  async addMessage(message: IMessage, roomId: string) {
    const room = await RoomModel.updateOne(
      { _id: roomId },
      { $push: { messages: message } }
    );
    return message;
  }
  async getMessagesByRoom(
    roomId: string,
    limit: number,
    offset: number,
    type: TypeMeesage | null
  ) {
    let query = { _id: roomId } as any;
    const select = {
      __v: 0,
      messages: { $slice: [offset, limit + offset] },
    };

    if (type) {
      query.messages = { $elemMatch: { type: type } };
    }
    console.log(query);
    const room = (await RoomModel.findOne(query, select).exec()) as any;
    if (!room) return [];
    return room.messages as IMessage[];
  }
}
export default new RoomRepository();
