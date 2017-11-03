import Rx from 'rxjs'

export default function createAnalyze$ (file) {
  return Rx.Observable.of(file)
    .map(file => ({
      analyzed: true
    }))
}
