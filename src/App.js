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
    this.state = reset()
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

    // apply block
    case KEYS.L:
        this.setState(dropBlock('left'))
        break;
    case KEYS.R:
        this.setState(dropBlock('right'))
        break;
    default: 
      console.info(event.keyCode)
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
      console.info(event.keyCode)
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

  function dropBlock(side) {
    return function (oldState) {      
      return updateGameWithNext(side, pickSide(side, oldState), oldState.next.slice(), oldState.keyToggles.slice())
    }
  }

function pickSide(side, oldState) {
  if (side === 'left') {
    return oldState.left.slice()
  } else if (side === 'right') {
    return oldState.right.slice()
  } else {
    throw new Error("side must be left/right, bus was: " + side)
  }
}

function updateGameWithNext(side, blockContainer, next, toggle) {
  let newBlocks = blockContainer.map(updateRowWithNext(blockEffect(next, toggle)));
  
  let result = {};  
  result[side] = newBlocks;
  result.next = randomArray(ROW_COUNT, [0,1]);

  if (newBlocks.some( row => row.indexOf(0) < 0)) {
    console.warn("row full -> RIP")
    result = reset()
  }
  return result;
}


function updateRowWithNext(effectiveNext) {
  return function (blocksInRow, rowIndex) {

    console.warn(JSON.stringify(blocksInRow) + "-" + JSON.stringify(effectiveNext))
    console.warn(rowIndex)
    let firstEmpty = blocksInRow.indexOf(0)

    if (effectiveNext[rowIndex] === 0) {
      console.info("not active")
    } else if (firstEmpty < 0) {
      console.info("full!")
    } else {
      console.info("block got filled")
      blocksInRow[firstEmpty] = 1
    }
    return blocksInRow    
  }
}

function blockEffect(next, toggle) {
  if (next.length !== toggle.length) {
    throw new Error("lengths must be equal, got: " + next + " and " + toggle)
  }
  return next.map( (x,i) => x ^ toggle[i] );
}

function reset() {
  return {
    left: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
    right: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
    next: randomArray(ROW_COUNT, [0,1]),
    keyToggles: createArray(ROW_COUNT, 0)
  }
}

  export default App;