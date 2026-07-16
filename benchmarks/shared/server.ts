import express, { Express } from "express";
import { Server } from "node:http";

export async function createServer(
  register: (app: Express) => void
): Promise<Server> {
  const app = express();

  register(app);

  return new Promise((resolve) => {
    const server = app.listen(3000, () => resolve(server));
  });
}