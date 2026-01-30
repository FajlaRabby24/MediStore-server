import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT || 4000,
  better_auth_secret: process.env.BETTER_AUTH_SECRET,
  better_auth_url: process.env.BETTER_AUTH_URL,
  app_url: process.env.APP_URL,
};
