import * as React from 'react'
import {hot} from 'react-hot-loader'

import {TextAnnotator, TokenAnnotator, Annotator} from '../../src'

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
    value: [
      {start: 3, end: 9, text: 'Monday', tag: 'date', color: '#FF0000'}
    ],
    entities: [
      {start: 3, end: 9, text: 'Monday', tag: {name:'date', color:'#FF0000'}}
    ],
    tags: [{name:'product', color:'#00FF00'}, {name:'person', color:'#008800'}, {name:'date', color:'#FF0000'}]
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
        <a target="_blank" href="https://github.com/mcamac/react-text-annotate">forked from</a>
        <div style={{display: 'flex', marginBottom: 24}}>
          <Card>
            <h4>without entities panel</h4>
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
        {/* <Card>
          <h4>Current Value</h4>
          <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
        </Card> */}
        <Card>
          <h4>with entities panel</h4>
          <Annotator 
            style={{
              maxWidth: 500
            }}
            phrase={TEXT}
            tags={this.state.tags}
            updateTags={(tags) => this.setState({tags})}
            entities={this.state.entities}
            updateEntities={(entities) => this.setState({entities})}
          />
        </Card>
      </div>
    )
  }
}

export default hot(module)(App)
