const Rx = require('rxjs')

module.exports = {
  id: 'analyze',
  factory: function createAnalyze$ (file) {
    return Rx.Observable.of(file)
      .map(file => ({
        analyzed: true,
        [file.filename]: true
      }))
  }
}
