import * as React from 'react'
import {selectionIsEmpty, selectionIsBackwards, splitWithOffsets} from './utils'
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import TextField from '@material-ui/core/TextField';

interface Tag {
  name: string
  color: string
}

interface Tags {
  tags: Tag[]
}

interface Entity {
  start: number
  end: number
  text: string
  tag: Tag
}
interface Entities {
  entities: Entity[]
}

export interface AnnotatorProps {
  phrase: string;
  style: object;
  tags: Tag[];
  updateTags: (Tags) => void;
  entities: Entity[];
  updateEntities: (Entities) => void;
}

export interface AnnotatorStates {
  open: boolean
  start: number
  end: number
  adding: boolean
  inputText: string
  clickX: number
  clickY: number
}

const Split = props => {
  if (props.mark) return (
    <mark
      style={{border: `3px solid ${props.tag.color}`,backgroundColor: 'white', padding: '0 4px'}}
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick ? props.onClick({start: props.start, end: props.end}) : null}
    >
      {props.text}
      {/* <span style={{fontSize: '0.7em', fontWeight: 500, marginLeft: 6}}>{props.tag.name}</span> */}
    </mark>
  )
  return (
    <span
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick ? props.onClick({start: props.start, end: props.end}) : null}
    >
      {props.content}
    </span>
  )
}

export default class Annotator extends React.Component<AnnotatorProps, AnnotatorStates> {
  rootRef: any
  menuRef: any
  constructor(props) {
    super(props)

    this.rootRef = (React as any).createRef()
    this.menuRef = (React as any).createRef()
  }
  public state: AnnotatorStates = {
    open: false,
    start: 0,
    end: 0,
    adding: false,
    inputText: '',
    clickX: 0,
    clickY: 0
  }
  componentDidMount() {
    this.rootRef.current.addEventListener('mouseup', this.handleMouseUp)
  }
  componentWillUnmount() {
    this.rootRef.current.removeEventListener('mouseup', this.handleMouseUp)
  }
  render() {
    const {phrase, entities, style} = this.props
    const splits = splitWithOffsets(phrase, entities)
    // this.props.updateTags(this.props.tags);
    return (
      <React.Fragment>
        {this.state.open && 
          <div 
            ref={this.menuRef} 
            style={{
              left: `${this.state.clickX}px`, 
              top: `${this.state.clickY + 10}px`,
              display: 'inline-block',
              position:'absolute',
            }}
          >
            <Paper>
              <MenuList>
                {this.props.tags.map((tag, index) => <MenuItem key={index} onClick={event => this.handleMenuItemClick(tag, index)}>{tag.name}</MenuItem>)}
                {
                  this.state.adding ?
                  <form onSubmit={this.handleSubmit}>
                    <TextField
                      defaultValue=""
                      margin="normal"
                      value={this.state.inputText}
                      onChange={this.handleChange}
                    />
                  </form> : 
                  <MenuItem onClick={this.handleAddTag}>add</MenuItem>
                }
              </MenuList>
            </Paper>
          </div>
        }
        tags : {this.props.tags.map((tag, index) => 
          <span key={index} style={{backgroundColor: tag.color, margin: '3px'}}>
            {tag.name}
          </span>)
        }
        <div style={{display: 'flex', marginBottom: 24}}>
          <div style={style} ref={this.rootRef}>
            {splits.map(split => (
              <Split key={`${split.start}-${split.end}`} {...split} />
            ))}
          </div>
          <div style={{border:'1px solid gray', padding: '5px'}}>
            {entities.map((entity, index) => {
              return (
                <div key={index} style={{margin:'10px'}}>
                  <span style={{backgroundColor: entity.tag.color, border: `3px solid ${entity.tag.color}`, margin: '5px'}}>{entity.tag.name}</span><span>{entity.text}</span>
                  <button onClick={() => this.handleSplitClick(entity.start, entity.end)}>x</button>
                </div>
              )
            })}
          </div>
        </div>
      </React.Fragment>
    )
  }
  handleSplitClick = (start, end) => {
    const splitIndex = this.props.entities.findIndex(s => s.start === start && s.end === end)
    if (splitIndex >= 0) {
      this.props.updateEntities([
        ...this.props.entities.slice(0, splitIndex),
        ...this.props.entities.slice(splitIndex + 1),
      ])
    }
  }
  handleMouseUp = (e) => {
    const selection = window.getSelection()

    if (selectionIsEmpty(selection)) {
      this.setState({open: false})
      return
    }

    const clickX = e.clientX;
    const clickY = e.clientY;

    let start =
      parseInt(selection.anchorNode.parentElement.getAttribute('data-start'), 10) +
      selection.anchorOffset
    let end =
      parseInt(selection.focusNode.parentElement.getAttribute('data-start'), 10) +
      selection.focusOffset

    if (selectionIsBackwards(selection)) {
      ;[start, end] = [end, start]
    }

    this.setState({
      open: true,
      start,
      end,
      clickX,
      clickY
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.updateTags([
      ...this.props.tags,
      {
        name: this.state.inputText,
        color: '#84d2ff'
      }
    ])
    this.setState({
      adding: false,
      inputText:''
    })
  }
  handleChange = (e) => {
    this.setState({
      inputText: e.target.value
    })
  }
  handleAddTag = () => {
    this.setState({adding: true})
  }
  handleMenuItemClick = (tag, index) => {
    this.props.updateEntities([
      ...this.props.entities,
      {
        start: this.state.start, 
        end: this.state.end, 
        text: this.props.phrase.slice(this.state.start, this.state.end),
        tag,
      }
    ])
    this.setState({open: false})

    window.getSelection().empty()
  }
}