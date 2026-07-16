import autocannon from "autocannon";

export interface BenchmarkResult {
  requestsPerSecond: number;
  latency: number;
  throughput: number;
  errors: number;
}

export async function runBenchmark(
  url: string,
  connections = 100,
  duration = 10
): Promise<BenchmarkResult> {
  const result = await autocannon({
    url,
    connections,
    duration,
  });

  return {
    requestsPerSecond: result.requests.average,
    latency: result.latency.average,
    throughput: result.throughput.average,
    errors: result.errors,
  };
}