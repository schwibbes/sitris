import React, { Component } from 'react';
import './Block.css';

class Block extends Component {

	render() {
		let st = 'block ' + (this.props.filled === 1 ? 'block-fill' : 'nofill');
		return (
			<div className={st}></div>
		);
	}
}

export default Block;