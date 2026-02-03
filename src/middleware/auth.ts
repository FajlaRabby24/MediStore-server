import { NextFunction, Request, Response } from "express";
import { auth as betteAuth } from "../lib/auth";
import { sendResponse } from "../utils/sendResponse";
import { UserRoles, UserStatus } from "./../constant/index";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export const auth = (...roles: UserRoles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get session
      const session = await betteAuth.api.getSession({
        headers: req.headers as any,
      });

      // if no session
      if (!session) {
        return sendResponse(res, 401, false, "Your are not authorized.");
      }

      // if user email isn't verified
      if (!session?.user.emailVerified) {
        return sendResponse(
          res,
          403,
          false,
          "Email verification requred. Please verify your email!",
        );
      }

      // check is user active or not
      if (session?.user?.status === UserStatus.BLOCKED) {
        return sendResponse(
          res,
          403,
          false,
          "Your account is currently inactive. Please contact support.",
        );
      }

      // set the user info into req
      req.user = {
        id: session?.user?.id,
        email: session?.user?.email,
        name: session?.user?.name,
        emailVerified: session?.user?.emailVerified,
        role: session?.user?.role!,
      };

      if (roles.length && !roles.includes(req.user.role as UserRoles)) {
        return sendResponse(
          res,
          403,
          false,
          "Forbidden! You don't have permission to access this resources!",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
