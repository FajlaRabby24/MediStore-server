import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { Request, Response } from "express";
import { config } from "./config";
import { auth } from "./lib/auth";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { sellerRouter } from "./modules/seller/sellerRouter";

const app = express();

// middleware
app.use(express.json());
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
