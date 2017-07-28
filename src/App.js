import React, { Component } from 'react';
import './App.css';
import * as Keys from './Keys.js'
import Block from './Block.js';

const COL_COUNT = 8
const ROW_COUNT = 4 // maps to keys asdf
const PREVIEW_COUNT = ROW_COUNT * 2
const SLOTS = 2
const COLORS = [1,2]
const RUN_TO_CLEAR = 4

class App extends Component {
  constructor() {
    super();
    this.state = reset()
  }

  _handleKeyDown (event) {
    let code = event.keyCode;
    if (Keys.isRowSelect(code)) {
      this.setState(toggleOn(Keys.rowIndexFromKeyCode(code)))
    } else if (Keys.isSideSelect(code)) {
      this.setState(dropBlock(Keys.sideFromKeyCode(code)))
    }
  }

  _handleKeyUp (event) {
    let code = event.keyCode;
    if (Keys.isRowSelect(code)) {
      this.setState(toggleOff(Keys.rowIndexFromKeyCode(code)))
    }
  }

  componentWillMount() {
    document.addEventListener('keydown', this._handleKeyDown.bind(this))
    document.addEventListener('keyup', this._handleKeyUp.bind(this))
  }

  render() {

    let leftBlocks = this.state.left.map(drawRow('l'));
    let rightBlocks = this.state.right.map(drawRow('r'));
    let nextBlocks = this.state.next.map(drawNext(this.state.activeSlots));

    return ( 
      <div className='block-container'>
        <div className='left-blocks'> {leftBlocks} </div>
        <div className='next-blocks'> {nextBlocks} </div>
        <div className='right-blocks'> {rightBlocks} </div>
      </div>
      );
    }
  }

function drawRow(side) {
  return function (row, rowIndex) {
    let rowId = side + '_' + rowIndex; 
    return (
      <div 
        key={rowIndex}
        className='block-row'>{row.map(drawBlock)}
      </div>
    )
  }
}

function drawNext(activeSlots) {
  return function (color, rowIndex) {
    return (<Block key={rowIndex} color={color} active={activeSlots.includes(rowIndex)}  txt={rowIndex} />);
  }
}

function drawBlock (color, colIndex) {
  return (<Block key={colIndex} color={color} active={false} />) ;
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
    return updateGameWithNext(side, pickSide(side, oldState), oldState.next.slice(), oldState.activeSlots.slice())
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

function updateGameWithNext(side, blockContainer, next, activeSlots) {
  let newBlocks = blockContainer
    .map(updateRowWithNext(next, activeSlots))
    .map(clearBlocks);
  
  let result = {};  
  result[side] = newBlocks;
  result.next = next.filter( (x,i) => !activeSlots.includes(i));
  while (result.next.length < PREVIEW_COUNT) {
    result.next.push(randomFromArray(COLORS));
  }

  if (newBlocks.some( row => row.indexOf(0) < 0)) {
    console.info("row full -> RIP")
    result = reset()
  }
  return result;
}

function clearBlocks(blocksInRow, rowIndex) { 

  let currentColor
  let run = 1

  for (var i = 0; i < blocksInRow.length; i++) {
    if (blocksInRow[i] === currentColor) {
      run++;
    }

    if (blocksInRow[i] !== 0)
    currentColor = blocksInRow[i];
  }

  if (run >= RUN_TO_CLEAR) {
    return blocksInRow.map(x => x === currentColor ? 0 : x);
  } else {
    return blocksInRow;
  }

}


function updateRowWithNext(next, activeSlots) {
  return function (blocksInRow, rowIndex) {
    console.info(JSON.stringify(blocksInRow) + "-" + JSON.stringify(next))
    let firstEmpty = blocksInRow.indexOf(0)

    if (next[rowIndex] === 0 || !activeSlots.includes(rowIndex)) {
      console.info("not active")
    } else if (firstEmpty < 0) {
      console.info("full!")
    } else {
      console.info("block got filled")
      blocksInRow[firstEmpty] = next[rowIndex]
    }
    return blocksInRow    
  }
}

function blockEffect(next, toggle) {
  if (next.length !== toggle.length) {
    throw new Error("lengths must be equal, got: " + next + " and " + toggle)
  }
  return next.map( (color,rowIndex) => Math.abs(1-toggle[rowIndex]) * color );
}

function toggleOn(rowIndex) {
  return function (oldState) {
    return { activeSlots: activate(oldState.activeSlots, rowIndex) };
  };
}

function toggleOff(rowIndex) {
  return function (oldState) {
    return { activeSlots: deactivate(oldState.activeSlots, rowIndex) };
  };
}

function updateValue(arr, index, value) {
  let result = arr.slice();
  result[index] = value;
  return result;
}

function activate(arr, rowIndex) {
  let result = arr.slice();
  
  if (!result.includes(rowIndex)){
    result.unshift(rowIndex);
  }

  if (result.length > SLOTS) {
    result.pop();
  }
  console.warn(result)
  return result;
}

function deactivate(arr, rowIndex) {
  return arr.filter(x => x !== rowIndex);
}

function reset() {
  return {
    left: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
    right: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
    next: randomArray(PREVIEW_COUNT, COLORS),
    activeSlots: []
  }
}

export default App;