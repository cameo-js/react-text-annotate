import * as React from 'react'
import {hot} from 'react-hot-loader'

import {TextAnnotator, TokenAnnotator} from '../../src'

const TEXT = `On Monday night , Mr. Fallon will have a co-host for the first time : The rapper Cardi B , who just released her first album, " Invasion of Privacy . "`

const Card = ({children}) => (
  <div
    style={{
      boxShadow: '0 2px 4px rgba(0,0,0,.1)',
      margin: 6,
      maxWidth: 800,
      padding: 16,
    }}
  >
    {children}
  </div>
)

class App extends React.Component<any, any> {
  state = {
    value: [],
  }

  handleChange = value => {
    this.setState({value})
  }

  handleTagChange = e => {
    this.setState({tag: e.target.value})
  }

  render() {
    return (
      <div style={{padding: 24, fontFamily: 'IBM Plex Sans'}}>
        <h3 style={{marginTop: 0}}>react-text-annotate</h3>
        <a href="https://github.com/mcamac/react-text-annotate">Github</a>
        <p>A React component for interactively highlighting parts of text.</p>
        <div style={{display: 'flex', marginBottom: 24}}>
          <Card>
            <h4>Default</h4>
            <TextAnnotator
              style={{
                maxWidth: 800,
                lineHeight: 1.5,
              }}
              content={TEXT}
              tags={['product', 'date', 'person']}
              value={this.state.value}
              onChange={this.handleChange}
            />
          </Card>
          {/* <Card>
            {this.state.value.map((entity, index) => {
              return (
                <div key={index}>
                  <span style={{margin:'10px', width:'200px', background:entity.color}}>{entity.tag}</span>
                  <span>{entity.text}</span>
                </div>
              );
            })}
          </Card> */}
        </div>
        <Card>
          <h4>Current Value</h4>
          <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
        </Card>
      </div>
    )
  }
}

export default hot(module)(App)
