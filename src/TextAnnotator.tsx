import * as React from 'react'

import Mark from './Mark'
import {selectionIsEmpty, selectionIsBackwards, splitWithOffsets} from './utils'
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import TextField from '@material-ui/core/TextField';

const TAG_COLORS = {
  product: '#00FF00',
  date: '#FF0000',
  person: '#008800',
  job: '#84d2ff'
}

const Split = props => {
  if (props.mark) return <Mark {...props} />

  return (
    <span
      data-start={props.start}
      data-end={props.end}
      onClick={() => props.onClick({start: props.start, end: props.end})}
    >
      {props.content}
    </span>
  )
}

interface TextAnnotatorProps {
  style: object
  content: string
  value: any[]
  tags: any[]
  onChange: (any) => any
  getSpan?: (any) => any
  // determine whether to overwrite or leave intersecting ranges.
}

interface TextAnnotatorStates {
  open: boolean
  tags: any[]
  start: number
  end: number
  adding: boolean
  inputText: string
  clickX: number
  clickY: number
}

// TODO: When React 16.3 types are ready, remove casts.
class TextAnnotator extends React.Component<TextAnnotatorProps, TextAnnotatorStates> {
  rootRef: any
  menuRef: any

  public state: TextAnnotatorStates = {
    open: false,
    tags: this.props.tags,
    start: 0,
    end: 0,
    adding: false,
    inputText: '',
    clickX: 0,
    clickY: 0
  }

  constructor(props) {
    super(props)

    this.rootRef = (React as any).createRef()
    this.menuRef = (React as any).createRef()
  }

  componentDidMount() {
    this.rootRef.current.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount() {
    this.rootRef.current.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = (e) => {
    if (!this.props.onChange) return

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

  handleMenuItemClick = (tag, index) => {
    this.props.onChange([
      ...this.props.value,
      this.getSpan({start: this.state.start, end: this.state.end, text: this.props.content.slice(this.state.start, this.state.end)}, tag),
    ])
    this.setState({open: false})

    window.getSelection().empty()
  }

  handleAddTag = () => {
    this.setState({adding: true})
  }

  handleSplitClick = ({start, end}) => {
    // Find and remove the matching split.
    const splitIndex = this.props.value.findIndex(s => s.start === start && s.end === end)
    if (splitIndex >= 0) {
      this.props.onChange([
        ...this.props.value.slice(0, splitIndex),
        ...this.props.value.slice(splitIndex + 1),
      ])
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      adding: false,
      tags: [
        ...this.state.tags,
        this.state.inputText
      ],
      inputText:''
    })
  }
  handleChange = (e) => {
    this.setState({
      inputText: e.target.value
    })
  }

  getSpan = (span, tag) => ({
    ...span,
    tag: tag,
    color: TAG_COLORS[tag],
  })

  render() {
    const {content, value, style} = this.props
    const splits = splitWithOffsets(content, value)
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
                {this.state.tags.map((tag, index) => <MenuItem key={index} onClick={event => this.handleMenuItemClick(tag, index)}>{tag}</MenuItem>)}
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
        tags : {this.state.tags.map((tag, index) => 
          <span key={index} style={{backgroundColor: TAG_COLORS[tag], margin: '3px'}}>
            {tag}
          </span>)
        }
        <div style={style} ref={this.rootRef}>
          {splits.map(split => (
            <Split key={`${split.start}-${split.end}`} {...split} onClick={this.handleSplitClick} />
          ))}
        </div>
      </React.Fragment>
    )
  }
}

export default TextAnnotator

