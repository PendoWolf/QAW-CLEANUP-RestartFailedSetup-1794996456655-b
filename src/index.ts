import * as pendo from "pendo-server-sdk";
import { createApp } from "./app.js";

// Pendo Agent Analytics for the Tripwise Assistant. Set PENDO_DISABLED=true to turn it off.
pendo.init({
  apiKey: "a794cf3d-c84c-4fd4-814c-c0ebe140cf5b",
  agentId: "fHtYiZwNBEkUbUgxyrQ-YycF7VE",
  endpoint: "https://app.pendo-dev.pendo-dev.com",
  autoPatch: true,
});

const port = Number(process.env.PORT) || 3001;
const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const server = createApp(corsOrigin).listen(port, () => {
  console.log(`Tripwise API on port ${port}, allowing ${corsOrigin}`);
});

// Sends the last buffered Pendo events before the server goes away.
server.on("close", () => {
  void pendo.shutdown();
});

async function stop(): Promise<void> {
  server.close();
  await pendo.shutdown();
  process.exit(0);
}

process.on("SIGINT", () => void stop());
process.on("SIGTERM", () => void stop());
