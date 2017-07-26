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
 L: 74,
 R: 75
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
        case KEYS.A:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 0, 1) }))
            break;
        case KEYS.S:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 1, 1) }))
            break;
        case KEYS.D:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 2, 1) }))
            break;
        case KEYS.F:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 3, 1) }))
            break;
        default: 
          console.log(event.keyCode)
            break;
    }
  }

  _handleKeyUp (event) {
    switch( event.keyCode ) {
        case KEYS.A:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 0, 0) }))
            break;
        case KEYS.S:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 1, 0) }))
            break;
        case KEYS.D:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 2, 0) }))
            break;
        case KEYS.F:
            this.setState(prev => ({keyToggles: setToggle(prev.keyToggles, 3, 0) }))
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
      let items = row.slice().reverse().map( (item,j) => { return <Block key={'b_' + i + "." + j} filled={item}/> })
      return <div key={'r_' + i} className='block-row'>{items}</div>
    });

    let nextBlocks = this.state.next.map( (b,i) => {
      let active = b ^ this.state.keyToggles[i]
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

  function setToggle(arr, index, value) {
    let result = arr.slice();
    result[index] = value;
    return result;
  }

  export default App;