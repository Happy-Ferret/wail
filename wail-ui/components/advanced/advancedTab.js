import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { Tabs, Tab } from 'material-ui/Tabs'
import General from './general'
import WayBackTab from '../archiveCollections/wayback'
import HeritrixTab from '../heritrix/heritrix-tab'
import Miscellaneous from './miscellaneous'

export default class AdvancedTab extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = { key: 'general' }
  }

  @autobind
  handleSelect (selectedKey) {
    this.setState({ key: selectedKey })
  }

  render () {
    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
      >
        <Tab label='General' value='general'>
          <General />
        </Tab>
        <Tab label='Wayback' value='wayback'>
          <WayBackTab />
        </Tab>
        <Tab label='Heritrix' value='heritrix'>
          <HeritrixTab />
        </Tab>
        <Tab label='Miscellaneous' value='miscellaneous'>
          <Miscellaneous />
        </Tab>
      </Tabs>
    )
  }
}
