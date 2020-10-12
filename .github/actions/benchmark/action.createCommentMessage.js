module.exports = ({ context, github, benchmarks }) =>
  `This pull request is automatically built and benchmarked with [BenchmarkJS](https://benchmarkjs.com/).

Latest deployment of this branch, based on commit ${context.sha}.

${benchmarks === null ? `Unfortunately, the benchmark failed.` : createBenchmarks(benchmarks)}
`;

const createBenchmarks = (benchmarks) => `| Benchmark   | ops/ms |    samples |
|:----------- | ------:| ----------:|
${benchmarks.map(({ name, hz, samples }) => `| **${name}** | ${hz}  | ${samples} |`).join('\n')}`;
