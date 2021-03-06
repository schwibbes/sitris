import React, { Component } from 'react';
import './Block.css';

class Block extends Component {

	render() {
		let style = ['block', `block-${this.props.color}`];
		if (this.props.active) {
			style.push('block-active')
		}
		return (
			<div className={style.join(' ')}>
				<span className='block-txt'>{this.props.txt}</span>
			</div>
		);
	}
}

export default Block;