const Rx = require('rxjs')
const { createLogger } = require('utils')

const log = createLogger('core')

module.exports = function initCore (options) {
  const defaultConfig = {
    plugins: [],
    concurrency: 1
  }
  const config = {
    ...defaultConfig,
    ...options
  }
  const source$ = Rx.Observable
    .interval(500).take(4)
    .map((x) => ({
      filename: `${x}.jpg`,
      processed: false,
      data: {
        keepme: true
      }
    }))
    .do((file) => log.info(`Recieved file ${file.filename}`))

  const core$ = source$
    // For any given file
    .mergeMap((file) => {
      // Create a observable of all activated plugins
      return Rx.Observable.from(config.plugins)
        // Load plugin async. To be replaced with sth like:
        // .mergeMap((name) => import(`plugin-${name}`))
        .map((name) => require(`plugin-${name}`))
        // and run them async based on concurrency
        .mergeMap(
          (plugin) => plugin.factory(file),
          null,
          config.concurrency
        )
        // Accumulate data results
        .reduce((data, result) => ({
          ...data,
          ...result
        }))
        // Create final file object
        .map((data) => ({
          ...file,
          // Set processed flag to true
          processed: true,
          // Inject new data into results
          data: {
            ...file.data,
            data
          }
        }))
    })
    .catch((err) => log.error(err))

  core$.subscribe((file) => log.info({file}, 'Finished file processing'))
}
