import type { NextFunction, Request, Response } from "express";
import status from "http-status";

import { UserStatus, type RolesName } from "../../../generated/prisma/enums";
import { config } from "../config";
import AppError from "../errorHandlers/AppError";
import { prisma } from "../lib/prisma";
import { cookieUtils } from "../utils/cookie";
import { jwtUtils } from "../utils/jwt";

export const checkAuth =
  (...authRoles: RolesName[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      const accessToken = cookieUtils.getCookie(req, "accessToken");

      if (!sessionToken && !accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized: No token provided",
        );
      }

      let userId: string | undefined;
      let userRole: RolesName | undefined;
      let userEmail: string | undefined;
      let userEmailVerified: boolean | undefined;

      // ✅ Step 1: Session token check
      if (sessionToken) {
        const session = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: { gt: new Date() },
          },
          include: {
            user: {
              select: {
                id: true,
                role: true,
                email: true,
                status: true,
                emailVerified: true,
              },
            },
          },
        });

        if (session?.user) {
          const user = session.user;

          if (user.status === UserStatus.BLOCKED) {
            throw new AppError(
              status.FORBIDDEN,
              "Your account is deactivated. Please contact support.",
            );
          }

          if (!user.emailVerified) {
            throw new AppError(
              status.FORBIDDEN,
              "Your email is not verified. Please verify your email.",
            );
          }

          // Session refresh header
          const now = new Date();
          const expiresAt = new Date(session.expiresAt);
          const createdAt = new Date(session.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
          }

          userId = user.id;
          userRole = user.role;
          userEmail = user.email;
          userEmailVerified = user.emailVerified;
        }
      }

      // ✅ Step 2: Access token check (only if session failed)
      if (!userId && accessToken) {
        const verifiedToken = jwtUtils.verifyToken(
          accessToken,
          config.ACCESS_TOKEN_SECRET,
        );

        if (!verifiedToken.success || !verifiedToken.data) {
          throw new AppError(status.UNAUTHORIZED, "Invalid access token");
        }

        const { userId: uid, role, email, sessionId } = verifiedToken.data;

        if (!uid || !role) {
          throw new AppError(status.UNAUTHORIZED, "Invalid token payload");
        }

        // ✅ Step 3: Verify session still exists in DB
        const sessionExists = await prisma.session.findFirst({
          where: {
            id: sessionId as string,
            userId: uid as string,
            expiresAt: { gt: new Date() },
          },
          select: { id: true },
        });

        if (!sessionExists) {
          // ✅ Clear all cookies since session is deleted
          cookieUtils.clearCookie(res, "accessToken", { httpOnly: true });
          cookieUtils.clearCookie(res, "refreshToken", { httpOnly: true });
          cookieUtils.clearCookie(res, "better-auth.session_token", {
            httpOnly: true,
          });

          throw new AppError(
            status.UNAUTHORIZED,
            "Session expired. Please login again.",
          );
        }

        userId = uid as string;
        userRole = role as RolesName;
        userEmail = email as string;
        userEmailVerified = true;
      }

      // ✅ Step 4: Final validation
      if (!userId || !userRole) {
        throw new AppError(status.UNAUTHORIZED, "Unauthorized: Invalid token");
      }

      // ✅ Step 5: Role check
      if (authRoles.length > 0 && !authRoles.includes(userRole as RolesName)) {
        throw new AppError(
          status.FORBIDDEN,
          "You are not authorized to access this resource",
        );
      }

      req.user = {
        id: userId,
        role: userRole,
        email: userEmail!,
        emailVerified: true,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
