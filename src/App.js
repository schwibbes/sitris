import React, {
  Component
} from 'react';
import './App.css';
import Block from './Block.js';

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

      ]
    }
  }

  render() {

    let leftBlocks = this.state.left.map(row => {
      let items = row.map(item => { return <Block filled={item}/> })
      return <div className='block-row'>{items}</div>
    })

    let rightBlocks = this.state.right.map(row => {
      let items = row.reverse().map(item => { return <Block filled={item}/> })
      return <div className='block-row'>{items}</div>
    })

    return ( 
      <div className='block-container'>
        <div className='left-blocks'> {leftBlocks} </div>
        <div className='right-blocks'> {rightBlocks} </div>
      </div>
      );
    }
  }

  export default App;