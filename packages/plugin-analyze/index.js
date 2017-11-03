const Rx = require('rxjs')
const bunyan = require('bunyan')

const log = bunyan.createLogger({name: 'plugin-optimize'})

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
