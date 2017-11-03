const Rx = require('rxjs')

const CONCURRENCY = 2

const enabledPlugins = ['analyze', 'optimize']

const source$ = Rx.Observable
  .interval(500).take(4)
  .map((x) => ({
    filename: `${x}.jpg`,
    processed: false,
    data: {
      keepme: true
    }
  }))

const core$ = source$
  // For any given file
  .mergeMap((file) => {
    // Create a observable of all activated plugins
    return Rx.Observable.from(enabledPlugins)
      // Load plugin async. To be replaced with sth like:
      // .mergeMap((name) => import(`plugin-${name}`))
      .map((name) => require(`plugin-${name}`))
      // and run them async based on concurrency
      .mergeMap(
        (plugin) => plugin.factory(file),
        null,
        CONCURRENCY
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

core$.subscribe((x) => console.log('done', x))
