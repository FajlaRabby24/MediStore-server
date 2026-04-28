import app from "./app";
import { config } from "./app/config";
import { prisma } from "./app/lib/prisma";

const port = config.PORT;

const main = async () => {
  try {
    await prisma.$connect();

    const server = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

    server.on("error", (error: any) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use.`);
      } else {
        console.error("Server error:", error);
      }
      process.exit(1);
    });

    server.on("close", () => {
      console.log("Server closed.");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

main();

export default app;
