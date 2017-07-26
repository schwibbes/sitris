import React, {
  Component
} from 'react';
import './App.css';
import Block from './Block.js';

const KEYS = {
 ESC: 27
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
      next: [0, 1, 1, 0]
    }
  }

  _handleKeyDown (event) {
    switch( event.keyCode ) {
        case KEYS.ESC:
            console.log("esc works")
            break;
        default: 
          console.log(event)
            break;
    }
  }

  componentWillMount() {
    document.addEventListener('keydown', this._handleKeyDown.bind(this))
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
      return <Block key={'n_'+i} filled = {1} txt={LOOKUP[i]}/>
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