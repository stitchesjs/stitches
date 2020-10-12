import Benchmark from 'benchmark';
import glob from 'tiny-glob';
import { resolve } from 'path';

type BenchmarksState = {
  /** Benchmark suites to be added by benchmark files. */
  allBenchmarks: Set<BenchmarkState>;

  /** Current benchmark being evaluated. */
  currentBenchmark: BenchmarkState | null;
};

type BenchmarkState = {
  /** Previous benchmark suite being evaluated. */
  previousBenchmark: BenchmarkState | null;

  /** Current benchmark suite being evaluated. */
  currentSuite: Benchmark.Suite;
};

const benchmarksState: BenchmarksState = {
  allBenchmarks: new Set(),
  currentBenchmark: null,
};

const benchmarkResults: any[] = [];

// define a global `describe` function that maps to BenchmarkJS
Reflect.set(globalThis, 'describe', (name: string, fn: Function) => {
  const benchmark: BenchmarkState = {
    previousBenchmark: benchmarksState.currentBenchmark,
    currentSuite: new Benchmark.Suite(name),
  };
  benchmark.currentSuite.on('cycle', ({ target }: { target: any }) => {
    console.log(String(target));
    return benchmarkResults.push(target);
  });
  benchmarksState.currentBenchmark = benchmark;
  benchmarksState.allBenchmarks.add(benchmark);
  fn();
  benchmarksState.currentBenchmark = benchmarksState.currentBenchmark?.previousBenchmark || null;
});

// define a global `test` function that maps to BenchmarkJS
Reflect.set(globalThis, 'test', (name: string, fn: Function) => {
  if (benchmarksState.currentBenchmark) {
    benchmarksState.currentBenchmark.currentSuite.add(name, fn);
  } else {
    const benchmark: BenchmarkState = {
      previousBenchmark: benchmarksState.currentBenchmark,
      currentSuite: new Benchmark.Suite(name),
    };
    benchmark.currentSuite.on('cycle', ({ target }: { target: any }) => {
      console.log(String(target));
      return benchmarkResults.push(target);
    });
    benchmark.currentSuite.add(name, fn);
    benchmarksState.allBenchmarks.add(benchmark);
  }
});

console.log('Benchmarking...');

// collect all benchmark tests
module.exports = glob('**/*.benchmark.ts')
  // prepare all benchmark tests
  .then((files: string[]) => Promise.all(files.map((file) => import(resolve(file)))))
  // run all benchmark tests
  .then(() => benchmarksState.allBenchmarks.forEach(({ currentSuite }) => currentSuite.run()))
  // return the results
  .then(() => benchmarkResults);
