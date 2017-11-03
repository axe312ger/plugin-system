const Rx = require('rxjs')
const { createLogger } = require('utils')

const log = createLogger('plugin-analyze')

module.exports = {
  id: 'analyze',
  factory: function createAnalyze$ (file) {
    return Rx.Observable.of(file)
      .do((file) => log.info(`Analyzed ${file.filename}`))
      .map(file => ({
        analyzed: true
      }))
  }
}
