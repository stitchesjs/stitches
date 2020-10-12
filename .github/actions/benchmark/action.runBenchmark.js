const { join } = require('path');

module.exports = async (cwd, file) => {
  require('@babel/register')({
    extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
  });

  const benchmarks = await require(join(cwd, file));

  return Array.from(Array.isArray(benchmarks) ? benchmarks : [benchmarks || []], (benchmark) => Object(benchmark)).map(
    (benchmark) => ({
      name: benchmark.name || (isNaN(benchmark.id) ? benchmark.id : `<Test #${benchmark.id}>`),
      hz: Number((Number(benchmark.hz) || 0).toFixed(benchmark.hz < 100 ? 2 : 0)) || 0,
      samples: Number(Object(Object(benchmark.stats).sample).length) || 0,
    })
  );
};
