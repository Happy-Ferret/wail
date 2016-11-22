import '../wailPollyfil'
import 'react-flex/index.css'
import './css/wail.css'
import React from 'react'
import {render} from 'react-dom'
import {hashHistory} from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import fs from 'fs-extra'
import Promise from 'bluebird'
import {remote} from 'electron'
import bunyan from 'bunyan'
import Wail from './containers/wail'
import wailConstants from './constants/wail-constants'
import configureStore from './stores/configureStore'
import createDetectElementResize from './vendor/detectElementResize'

window.React = React
if (process.env.NODE_ENV === 'development') {
  window.Perf = require('react-addons-perf')
}

Promise.promisifyAll(fs)

global.resizer = createDetectElementResize()

window.lastWaybackPath = wailConstants.Default_Collection

injectTapEventPlugin()

const wail = document.getElementById('wail')
window.eventLog = new bunyan.RingBuffer({ limit: 100 })

window.logger = bunyan.createLogger({
  name: 'wail-ui',
  streams: [
    {
      level: 'info',
      path: remote.getGlobal('wailUILogp')
    },
    {
      level: 'debug',
      type: 'raw',    // use 'raw' to get raw log record objects
      stream: window.eventLog
    }
  ]
})

// process.on('uncaughtException', (err) => {
//   console.error(err)
//   window.logger.error(err)
// })

const store = configureStore()
// const history = syncHistoryWithStore(hashHistory, store, {
//   selectLocationState (state) {
//     console.log('select location state', state.get('routing'))
//     return  state.get('routing') ? state.get('routing').toJS() : {}
//   }
// })
render(<Wail store={store} history={hashHistory}/>, document.getElementById('wail'))

