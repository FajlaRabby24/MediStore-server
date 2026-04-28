import type { IRequestUser } from "../interface/request.user";

declare global {
  namespace Express {
    interface Request {
      user: IRequestUser;
    }
  }
}
