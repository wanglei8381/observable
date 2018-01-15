const path$ = require('path')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const nodeResolve = require('rollup-plugin-node-resolve')

const resolve = path => path$.resolve(__dirname, '../', path)

const config = {
  dev: {
    input: resolve('src/index'),
    output: {
      file: resolve('dist/rx.js'),
      format: 'umd'
    },
    env: 'development'
  },

  build_umd: {
    input: resolve('src/index'),
    output: {
      file: resolve('dist/rx.min.js'),
      format: 'umd'
    },
    env: 'production',
    uglify: true
  },

  build_cjs: {
    input: resolve('src/index'),
    output: {
      file: resolve('dist/rx.common.js'),
      format: 'cjs'
    }
  },

  build_esm: {
    input: resolve('src/index'),
    output: {
      file: resolve('dist/rx.esm.js'),
      format: 'es'
    }
  }
}

const getConfig = (opts) => {
  const config = {
    input: opts.input,
    output: {
      file: opts.output.file,
      format: opts.output.format,
      name: 'Rx'
    },
    plugins: [
      // 没有写在.babelrc里是因为和jest配置冲突
      babel({
        exclude: 'node_modules/**',
        plugins: ['external-helpers']
      }),
      nodeResolve()
    ]
  }

  if (opts.env) {
    config.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  if (opts.uglify) {
    config.plugins.push(uglify())
  }

  return config
}

module.exports = Object.keys(config).reduce((res, key) => {
  res[key] = getConfig(config[key])
  return res
}, {})