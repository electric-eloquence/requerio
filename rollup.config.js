export default {
  input: 'src/requerio.js',
  output: [
    {
      file: 'dist/requerio.npm.js',
      format: 'cjs'
    },
    {
      file: 'dist/requerio.npm.mjs',
      format: 'esm'
    }
  ]
};
