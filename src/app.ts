import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import path from "path";
import qs from "qs";
import { config } from "./app/config";
import { auth } from "./app/lib/auth";
import { globalErrorHandler } from "./app/middleware/errorHandler";
import { notFound } from "./app/middleware/notFound";
import {
  authLimiter,
  globalLimiter,
  readLimiter,
  writeLimiter,
} from "./app/middleware/rateLimit";
import { indexRoute } from "./app/routes";

const app: Application = express();

app.set("query parser", (str: string) => qs.parse(str));
app.set("view engine", "ejs");

// In production (after `tsc`), files live in dist/ not src/
// Templates must be copied alongside compiled JS (see postbuild script)
const viewsPath =
  process.env.VERCEL || config.NODE_ENV !== "production"
    ? path.resolve(process.cwd(), "src/app/templates")
    : path.resolve(process.cwd(), "dist/app/templates");
app.set("views", viewsPath);

// 1. Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);
app.use(
  cors({
    credentials: true,
    origin: [config.FRONTEND_URL, config.BETTER_AUTH_URL, config.SERVER_URL],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 2. Global rate limit — applied to every request
app.use(globalLimiter);

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Strict auth limiter
app.use("/api/auth", authLimiter);
app.use("/api/v1/auth", authLimiter);

// 5. Better Auth handler
app.use("/api/auth", toNodeHandler(auth));

// 6. API routes with targeted limiters
// Public read endpoints (medicines, categories)
app.use("/api/v1/medicine", readLimiter);
// Write/mutation endpoints (orders, cart, reviews)
app.use("/api/v1/user", writeLimiter);
// All other API routes use global limiter (already applied above)
app.use("/api/v1", indexRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route.",
  });
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
