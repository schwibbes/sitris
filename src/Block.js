import React, { Component } from 'react';
import './Block.css';

class Block extends Component {

	render() {
		let st = 'block ' + (this.props.filled === 1 ? 'block-fill' : 'block-nofill');
		return (
			<div className={st}>
				<span className='block-txt'>{this.props.txt}</span>
			</div>
		);
	}
}

export default Block;