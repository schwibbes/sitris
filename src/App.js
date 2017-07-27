import React, {
  Component
} from 'react';
import './App.css';
import Block from './Block.js';

const COL_COUNT = 8
const ROW_COUNT = 4 // maps to keys asdf

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
      left: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
      right: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
      next: randomArray(ROW_COUNT, [0,1]),
      keyToggles: createArray(ROW_COUNT, 0)
    }
  }

  _handleKeyDown (event) {
    switch( event.keyCode ) {
        
        // toggle on next
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

        // apply
        case KEYS.L:
            this.setState(prev => ({left: applyNext(prev.left.slice(), prev.next.slice(), prev.keyToggles.slice()) }))
            break;
        case KEYS.R:
            this.setState(prev => ({right: applyNext(prev.right.slice(), prev.next.slice(), prev.keyToggles.slice()) }))
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

  function applyNext(blocks, next, toggles) {
    console.log(JSON.stringify(blocks) + "-" + toggles)
    return blocks.map( (data,i) => {
      let firstEmpty = data.indexOf(0)
      let active = (next[i] ^ toggles[i]) === 1

      if (!active) {
        console.log("not active")
      } else if (firstEmpty < 0) {
        console.log("full!")
      } else {
        console.log("block got filled")
        data[firstEmpty] = 1
      }
      return data
    })
  }

  function createArray(size, fill) {
    
    let result = []
    for (var i = 0; i < size; i++) {
      if (typeof fill === 'function') {
        result.push(fill.call())
      } else {
        result.push(fill);
      }
    }
    return result;
  }

  function randomArray(size, elements) {
    let result = []
    for (var i = 0; i < size; i++) {
      result.push(randomFromArray(elements))
    }
    return result;    
  }

  function randomFromArray(array) {
    return array[Math.floor(Math.random()*array.length)];
  }

  export default App;