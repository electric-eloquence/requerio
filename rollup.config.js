import babel from 'rollup-plugin-babel';

export default {
  input: 'src/requerio.js',
  output:{
    file: 'dist/requerio.npm.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          'env',
          {
            modules: false
          }
        ]
      ],
      plugins: ['external-helpers']
    })
  ]
};
