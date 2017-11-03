const bunyan = require('bunyan')

const BUNYAN_KES = [
  'name',
  'hostname',
  'pid',
  'level',
  'msg',
  'time',
  'v'
]

function ConsoleLogStream () {}

ConsoleLogStream.prototype.write = function (rec) {
  const data = Object.keys(rec)
    .reduce((data, key) => {
      if (BUNYAN_KES.includes(key)) {
        return data
      }
      return {
        ...data,
        [key]: rec[key]
      }
    }, false)
  const json = JSON.stringify(data, null, 2)
  console.log('[%s] %s: %s',
    rec.time.toISOString(),
    bunyan.nameFromLevel[rec.level],
    `${rec.msg}${(data ? `\n${json}` : '')}`)
}

module.exports = {
  createLogger: function createLogger (name) {
    return bunyan.createLogger({
      name,
      streams: [
        {
          stream: new ConsoleLogStream(),
          type: 'raw'
        }
      ]
    })
  }
}
