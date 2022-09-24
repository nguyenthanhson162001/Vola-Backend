import { Server, Socket } from "socket.io";
import logger from "../../infrastructure/logger";
import { IMessage } from "../entities/Room";
import { IUser } from "../entities/User";
import Client from "./Client";
export default class SocketMain {
  users: Map<
    string,
    {
      dirver: number;
      user: IUser;
    }
  >; // <userId, User>
  private io: Server;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    this.users = new Map<
      string,
      {
        dirver: number;
        user: IUser;
      }
    >(); // <userId, User>
    this.startSocket();
  }

  private startSocket() {
    this.io.on("connection", this.onConnection.bind(this));
  }

  private onConnection(client: Socket) {
    const { token } = client.handshake.query as { token: string };
    logger.info(`Connection from ${client.id}`);

    new Client(client, this, token);
  }
  serverSendMessageToUsers(userIds: string[], message: IMessage) {
    userIds.forEach((e) => {
      this.io.to(String(e)).emit("server-send-message", message);
    });
  }
}
