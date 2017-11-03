const Rx = require('rxjs')

module.exports = {
  id: 'optimize',
  factory: function createAnalyze$ (file) {
    return Rx.Observable.of(file)
      .delay(200)
      .map(file => ({
        optimized: true
      }))
  }
}
