import React, { Component } from 'react';
import './App.css';
import * as Keys from './Keys.js'
import Block from './Block.js';

const COL_COUNT = 8
const ROW_COUNT = 4 // maps to keys asdf
const COLORS = [0,1,2]

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
    let nextBlocks = this.state.next.map(drawNext(blockEffect(this.state.next,this.state.keyToggles)));

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
        key={rowId}
        className='block-row'>{row.map(drawBlock(rowId))}
      </div>
    )
  }
}

function drawNext(toggle) {
  return function (color, rowIndex) {
    let id = 'next_' + rowIndex;
    return (<Block key={id} color={toggle[rowIndex]} />);
  }
}


function drawBlock(rowId) {
  return function (color, colIndex) {
    return (<Block key={`${rowId}_b.${colIndex}`} color={color}/>) ;
  }
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
  result.next = randomArray(ROW_COUNT, COLORS);

  if (newBlocks.some( row => row.indexOf(0) < 0)) {
    console.info("row full -> RIP")
    result = reset()
  }
  return result;
}


function updateRowWithNext(effectiveNext) {
  return function (blocksInRow, rowIndex) {
    console.info(JSON.stringify(blocksInRow) + "-" + JSON.stringify(effectiveNext))
    let firstEmpty = blocksInRow.indexOf(0)

    if (effectiveNext[rowIndex] === 0) {
      console.info("not active")
    } else if (firstEmpty < 0) {
      console.info("full!")
    } else {
      console.info("block got filled")
      blocksInRow[firstEmpty] = effectiveNext[rowIndex]
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
    return { keyToggles: updateValue(oldState.keyToggles, rowIndex, 1) };
  };
}

function toggleOff(rowIndex) {
  return function (oldState) {
    return { keyToggles: updateValue(oldState.keyToggles, rowIndex, 0) };
  };
}

function updateValue(arr, index, value) {
  let result = arr.slice();
  result[index] = value;
  return result;
}


function reset() {
  return {
    left: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
    right: createArray(ROW_COUNT, () => createArray(COL_COUNT, 0)),
    next: randomArray(ROW_COUNT, COLORS),
    keyToggles: createArray(ROW_COUNT, 0)
  }
}

  export default App;