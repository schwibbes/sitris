import React, {
  Component
} from 'react';
import './App.css';
import Block from './Block.js';

const KEYS = {
 ESC: 27,
 // toggles
 A: 65,
 S: 83,
 D: 68,
 F: 70,
 // dirs
 L: 37,
 R: 39
};

const LOOKUP = {
  0: 'a',
  1: 's',
  2: 'd',
  3: 'f'
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      left: [
        [1, 0, 0, 0],
        [1, 1, 1, 1],
        [1, 1, 0, 0],
        [1, 0, 0, 0]
      ],
      right: [
        [1, 1, 0, 0],
        [1, 1, 1, 1],
        [1, 1, 0, 0],
        [1, 0, 0, 0]
      ],
      next: [0, 1, 1, 0],
      // 00 -> 0
      // 01 -> 1
      // 10 -> 1
      // 10 -> 0
      keyToggles: [1, 1, 0, 0]
    }
  }

  _handleKeyDown (event) {
    switch( event.keyCode ) {
        case KEYS.ESC:
            console.log("esc works")
            break;
        case KEYS.A:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[0] = 1
            return {keyToggles: newToggles }
          })
            break;
        case KEYS.S:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[1] = 1
            return {keyToggles: newToggles }
          })
            break;
        case KEYS.D:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[2] = 1
            return {keyToggles: newToggles }
          })
            break;
        case KEYS.F:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[3] = 1
            return {keyToggles: newToggles }
          })
            break;
        default: 
          console.log(event.keyCode)
            break;
    }
  }

  _handleKeyUp (event) {
    switch( event.keyCode ) {
        case KEYS.A:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[0] = 0
            return {keyToggles: newToggles }
          })
            break;
        case KEYS.S:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[1] = 0
            return {keyToggles: newToggles }
          })
            break;
        case KEYS.D:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[2] = 0
            return {keyToggles: newToggles }
          })
            break;
        case KEYS.F:
            this.setState(prev => {
              let newToggles = prev.keyToggles.slice()
              newToggles[3] = 0
            return {keyToggles: newToggles }
          })
            break;
        default: 
          console.log(event.keyCode)
            break;
    }
  }

  componentWillMount() {
    document.addEventListener('keydown', this._handleKeyDown.bind(this))
    document.addEventListener('keyup', this._handleKeyUp.bind(this))
  }

  render() {

    let leftBlocks = this.state.left.map( (row, i) => {
      let items = row.map( (item,j) => { return <Block key={'b_' + i + "." + j} filled={item}/> })
      return <div key={'r_' + i} className='block-row'>{items}</div>
    });

    let rightBlocks = this.state.right.map( (row,i) => {
      let items = row.reverse().map( (item,j) => { return <Block key={'b_' + i + "." + j} filled={item}/> })
      return <div key={'r_' + i} className='block-row'>{items}</div>
    });

    let nextBlocks = this.state.next.map( (b,i) => {
      let active = b ^ this.state.keyToggles[i]
      console.log(active)
      return <Block key={'n_'+i} filled = {active} txt={LOOKUP[i]}/>
    });

    return ( 
      <div className='block-container'>
        <div className='left-blocks'> {leftBlocks} </div>
        <div className='next-blocks'> {nextBlocks} </div>
        <div className='right-blocks'> {rightBlocks} </div>
      </div>
      );
    }
  }

  export default App;