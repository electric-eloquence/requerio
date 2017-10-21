import babel from 'rollup-plugin-babel';

export default {
  input: 'src/requerio.js',
  output:{
    file: 'dist/requerio.module.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [
        [
          'es2015',
          {
            modules: false
          }
        ]
      ],
      plugins: ['external-helpers']
    })
  ]
};
