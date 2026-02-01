import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { sellerRouter } from "./modules/seller/sellerRouter";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

// middleware
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.all("/api/auth/*spalte", toNodeHandler(auth));

app.use("/api/seller", sellerRouter);

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route.",
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
