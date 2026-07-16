import { createServer } from "../shared/server.js";
import { runBenchmark } from "../shared/autocannon.js";
import { printResult } from "../shared/utils.js";

async function main() {
  const server = await createServer((app) => {
    app.get("/", (_, res) => {
      res.send("Velorate");
    });
  });

  const result = await runBenchmark(
    "http://localhost:3000"
  );

  printResult("Velorate", result);

  server.close();
}

main();