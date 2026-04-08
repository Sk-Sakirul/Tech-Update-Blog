/* eslint-env node */
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

const startServer = async () => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `Port ${env.port} is already in use. Stop the existing process or change PORT in backend/.env.`
      );
      process.exit(1);
    }

    console.error("Server failed to start:", error);
    process.exit(1);
  });
};

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
