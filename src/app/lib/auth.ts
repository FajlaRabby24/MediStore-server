import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
// import { RolesName } from "../../../generated/prisma";
import { config } from "../config";
// import { UserRoles, UserStatus } from "../constant";
// import { sendEmail } from "../utils/email";
import { RolesName, UserStatus } from "../../../generated/prisma/enums";
import { sendEmail } from "../utils/email";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: config.BETTER_AUTH_URL,
  secret: config.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [config.FRONTEND_URL, config.BETTER_AUTH_URL, config.SERVER_URL],
  advanced: {
    useSecureCookies: config.NODE_ENV === "production",
    cookies: {
      session_token: {
        name: "session_token",
        attributes: {
          sameSite: config.NODE_ENV === "production" ? "none" : "lax",
          secure: config.NODE_ENV === "production",
          httpOnly: true,
          path: "/",
          partitioned: true,
        },
      },
      state: {
        name: "session_token",
        attributes: {
          sameSite: config.NODE_ENV === "production" ? "none" : "lax",
          secure: config.NODE_ENV === "production",
          httpOnly: true,
          path: "/",
          partitioned: true,
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,

      mapProfileToUser: () => {
        return {
          role: RolesName.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
        };
      },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: RolesName.USER,
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
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            return;
          }

          if (
            user?.role === RolesName.ADMIN ||
            user?.role === RolesName.SELLER
          ) {
            return;
          }

          if (user && !user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            return;
          }

          if (user) {
            await sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],
});
