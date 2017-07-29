import React, { Component } from 'react';
import './App.css';
import * as Keys from './Keys.js'
import Block from './Block.js';
import Score from './Score.js';

const COL_COUNT = 8 // width of block container
const ROW_COUNT = 4 // maps to keys asdf
const PREVIEW_COUNT = ROW_COUNT * 2 // visible next blocks
const SLOTS = 4 // number of simultaneous rows to activate
const COLORS = [1,2,3] // available colors
const RUN_TO_CLEAR = 3 // how many adjacent blocks for a clear
const SCORE = 100 // base score multiplier

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
        <Score time='2:00' points={this.state.points} />
      </div>
      );
    }
  }

function drawRow(side) {
  return function (row, rowIndex) {
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
    return updateGameWithNext(side, pickSide(side, oldState), oldState.next.slice(), oldState.activeSlots.slice(), oldState.points)
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

function updateGameWithNext(side, oldBlocks, next, activeSlots, points) {
  let newBlocks = oldBlocks.map(updateRowWithNext(next, activeSlots))
  newBlocks = clearBlocks(newBlocks);
  
  let result = {};  
  result[side] = newBlocks;
  result.points = points + SCORE * (countBlocks(oldBlocks) - countBlocks(newBlocks))
  //result.points = countBlocks(newBlocks)

  result.next = next.filter( (x,i) => !activeSlots.includes(i));
  while (result.next.length < PREVIEW_COUNT) {
    result.next.push(randomFromArray(COLORS));
  }

  if (newBlocks.some( row => row.indexOf(0) < 0)) {
    result = reset()
  }
  return result;
}

function countBlocks(rows) {
  let result = 0;
  for (var i = 0; i < rows.length; i++) {
    result += countBlocksInRow(rows[i]);
  }
  return result;
}

function countBlocksInRow(row) {
  return row.filter(col => col !== 0).length;
}

// clear rows and cols
// collect first then remove all at once 
function clearBlocks(rowsOfBlocks) { 

  // collect in same row
  let runsHorizontal = findRunsHorizontal(rowsOfBlocks)
  console.log(JSON.stringify(runsHorizontal))
  runsHorizontal = runsHorizontal.map(row => row.filter(run => run.color !== 0))
  console.log(JSON.stringify(runsHorizontal))
  runsHorizontal = runsHorizontal.map(row => row.filter(run => run.elements.length >= RUN_TO_CLEAR))
  console.log(JSON.stringify(runsHorizontal))
  console.log("--")
  // collect in same column
  // ...

  return rowsOfBlocks.map(clearBlocksInRow(runsHorizontal))
}

function clearBlocksInRow(runsH) {
  return function (blocksInRow, rowIndex) {
    return blocksInRow.map((block, index) => runsH[rowIndex].some(run => run.elements.includes(index)) ? 0 : block )
  }
}

export function findRunsHorizontal(rowsOfBlocks) {
  return rowsOfBlocks.map(row => {
    let result = []

    for (var i = 0; i < row.length; i++) {
      let block = row[i]
      let current = last(result)
      if (current && current.color === block) {
        current.elements.push(i)
      } else {
        result.push({color: block, elements:[i]});
      }
    }
    return result
  });
}

function last(arr) {
  if (arr && arr.length > 0) {
    return arr[arr.length-1];
  } else {
    return null;
  }
}

function updateRowWithNext(next, activeSlots) {
  return function (blocksInRow, rowIndex) {
    let firstEmpty = blocksInRow.indexOf(0)

    if (next[rowIndex] === 0 || !activeSlots.includes(rowIndex)) {
    } else if (firstEmpty < 0) {
    } else {
      blocksInRow[firstEmpty] = next[rowIndex]
    }
    return blocksInRow    
  }
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

function activate(arr, rowIndex) {
  let result = arr.slice();
  
  if (!result.includes(rowIndex)){
    result.unshift(rowIndex);
  }

  if (result.length > SLOTS) {
    result.pop();
  }
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
    activeSlots: [],
    time: 60,
    points: 0
  }
}

export default App;