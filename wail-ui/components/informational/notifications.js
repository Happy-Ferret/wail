import React, {Component, PropTypes} from 'react'
import {ipcRenderer as ipc} from 'electron'
import Notification from 'react-notification-system'
import wailConstants from '../../constants/wail-constants'
// https://github.com/igorprado/react-notification-system

const EventTypes = wailConstants.EventTypes

export default class Notifications extends Component {
  constructor (props) {
    super(props)
    this.$notificationSub = null
    this.notifier = null
  }

  componentDidMount () {
    ipc.on('display-message', ::this.ipcNotif)
    ipc.on('log-error-display-message', (e, em) => {
      this.ipcNotif(e, em.m)
      window.logger.error(new Error(em.err))
    })
    this.$notificationSub = global.notifications$.subscribe({
      next: (notif) => {
        this.receiveMessage(notif)
      }
    })
    // GMessageStore.on('new-message', ::this.receiveMessage)
  }

  componentWillUnmount () {
    this.$notificationSub.unsubscribe()
    this.$notificationSub = null
    // GMessageStore.removeListener('new-message', ::this.receiveMessage)
  }

  ipcNotif (e, notif) {
    if (notif) {
      if (Reflect.has(notif, 'wasError')) {
        window.logger.error(notif.err, notif.message.message)
        this.notifier.addNotification(notif.message)
      } else {
        this.notifier.addNotification(notif)
      }
    }
  }

  receiveMessage (notif) {
    console.log(notif)
    // console.log('reciever message')
    // let message = GMessageStore.getMessage()
    // this.notifier.addNotification(message)
    if (notif) {
      if (notif.type === EventTypes.QUEUE_MESSAGE) {
        this.notifier.addNotification(notif.message)
      } else {
        console.log('unreconized notfication', notif)
      }
    }

  }

  render () {
    return (
      <Notification ref={(c) => { this.notifier = c }}/>
    )
  }
}
