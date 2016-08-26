import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import LoadingProgress from './fLoadingProgress'
require('pretty-error').start()
require('../../css/toaster.css')
require('../../css/animate.css')
window.React = React

injectTapEventPlugin()

ReactDOM.render(
  <LoadingProgress />,
  document.getElementById('loading'))
