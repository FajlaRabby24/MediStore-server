import express, { Request, Response } from "express";

const app = express();

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route.",
  });
});

export default app;
