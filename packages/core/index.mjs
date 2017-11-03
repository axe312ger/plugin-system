import Rx from 'rxjs'

import createAnalyze$ from 'plugin-analyze'

const CONCURRENCY = 2

const plugins = [{
  id: 'analyze',
  factory: createAnalyze$
},
{
  id: 'analyze2',
  factory: createAnalyze$
}]

const source$ = Rx.Observable
  .interval(500).take(4)
  .map((x) => ({
    filename: `${x}.jpg`,
    data: {
      keepme: true
    }
  }))

const core$ = source$
  // For any given file
  .mergeMap((file) => {
    // Create a observable of all activated plugins
    return Rx.Observable.from(plugins)
      // and run them async based on concurrency
      .mergeMap(
        // run plugin
        (plugin) => plugin.factory(file),
        // prepare data for storage
        (plugin, result) => ({
          [plugin.id]: result
        }),
        CONCURRENCY
      )
      // Accumulate data results
      .reduce((data, result) => ({
        ...data,
        ...result
      }))
      // Inject new data into results
      .map((data) => ({
        ...file,
        data: {
          ...file.data,
          data
        }
      }))
  })

core$.subscribe((x) => console.log('done', x))
