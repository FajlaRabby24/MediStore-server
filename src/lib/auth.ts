import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { config } from "../config";
import { UserRoles, UserStatus } from "../constant";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  // email verification
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  trustedOrigins: [config.app_url!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: UserRoles.USER,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: UserStatus.ACTIVE,
      },
    },
  },
});
