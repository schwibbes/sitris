import React, { Component } from 'react';
import './Score.css';

class Score extends Component {
	render() {
		return (
			<div className='score-container'>
				<span className='score-points'>{this.props.points}</span>
				<span className='score-time'>{this.props.time}</span>
			</div>
		);
	}
}

export default Score;