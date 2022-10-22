import { Response } from "express";
import RoomRepository from "../../../infrastructure/mongoose/repositories/RoomRepository";
import UserRepository from "../../../infrastructure/mongoose/repositories/UserRepository";
import Handler from "..//Handler";
import firebaseAdmin from "..//..//..//infrastructure/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { app } from "..//..//..//infrastructure/firebase/firebaseConfigClient";

export interface ILoginRequest {
  email: string;
  password: string;
}
interface IInputValidate {
  email: string;
  password: string;
}
class LoginHandler extends Handler<ILoginRequest> {
  static handle() {
    throw new Error("Method not implemented.");
  }
  protected async validate(request: ILoginRequest): Promise<IInputValidate> {
    const { email, password } = request;
    return { email, password };
  }
  public async handle(request: ILoginRequest): Promise<any> {
    const { email, password } = await this.validate(request);
    const auth = getAuth(app);
    const userCreate = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    sendEmailVerification(userCreate.user);
    // const user = await signInWithEmailAndPassword(auth, email, password);
    return userCreate;
  }
}
export default new LoginHandler();
