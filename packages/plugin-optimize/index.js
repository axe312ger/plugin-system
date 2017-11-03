const Rx = require('rxjs')

const { createLogger } = require('utils')

const log = createLogger('plugin-optimize')

module.exports = {
  id: 'optimize',
  factory: function createAnalyze$ (file) {
    return Rx.Observable.of(file)
      .delay(200)
      .do((file) => log.info(`Optimized ${file.filename}`))
      .map(file => ({
        optimized: true
      }))
  }
}
