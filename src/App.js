import React, { Component } from 'react';
import './App.css';
import * as Keys from './Keys.js'
import Block from './Block.js';

const COL_COUNT = 8
const ROW_COUNT = 4 // maps to keys asdf

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
      return <Block key={'n_'+i} filled = {active} txt={Keys.keyFromRowIndex(i)}/>
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
    console.info("row full -> RIP")
    result = reset()
  }
  return result;
}


function updateRowWithNext(effectiveNext) {
  return function (blocksInRow, rowIndex) {

    console.info(JSON.stringify(blocksInRow) + "-" + JSON.stringify(effectiveNext))
    console.info(rowIndex)
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

function toggleOn(rowIndex) {
  return function (oldState) {
    return { keyToggles: setToggle(oldState.keyToggles, rowIndex, 1) };
  };
}

function toggleOff(rowIndex) {
  return function (oldState) {
    return { keyToggles: setToggle(oldState.keyToggles, rowIndex, 0) };
  };
}

function setToggle(arr, index, value) {
  let result = arr.slice();
  result[index] = value;
  return result;
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