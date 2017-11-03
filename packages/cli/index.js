const core = require('core')
const { createLogger } = require('utils')

const log = createLogger('cli')
const argv = require('yargs').argv

const concurrency = ~~(argv.concurrency) || 1

const plugins = Object.keys(argv)
  .reduce((plugins, argument) => {
    if (!argument.startsWith('plugin-') || argument.length < 8) {
      return plugins
    }
    return [
      ...plugins,
      argument.slice(7)
    ]
  }, [])

log.info({concurrency, plugins}, 'Starting core with options:')

core({
  concurrency,
  plugins
})
