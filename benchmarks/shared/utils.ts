import { BenchmarkResult } from "./autocannon.js";

export function printResult(
  name: string,
  result: BenchmarkResult
) {
  console.log("");
  console.log("======================================");
  console.log(name);
  console.log("======================================");

  console.log(
    `Requests/sec : ${result.requestsPerSecond.toFixed(2)}`
  );

  console.log(
    `Latency      : ${result.latency.toFixed(2)} ms`
  );

  console.log(
    `Throughput   : ${(result.throughput / 1024 / 1024).toFixed(2)} MB/s`
  );

  console.log(`Errors       : ${result.errors}`);

  console.log("");
}