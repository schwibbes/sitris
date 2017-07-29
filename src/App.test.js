import React from 'react';
import ReactDOM from 'react-dom';
import App, * as AppModule from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

describe('find runs in all rows', () => {
	it('small sample', () => {
		let input=[];
		input.push([1,0,0]);
		input.push([0,0,0]);

		let result = [];
		result.push([{color: 1, elements: [0]}, {color: 0, elements: [1,2]}]);
		result.push([{color: 0, elements: [0,1,2]}]);

		expect(AppModule.findRunsHorizontal(input)).toEqual(result);
	});

	it('mid sample', () => {
		let input=[]
		input.push([1,0,0,0,1,1])
		input.push([1,1,1,0,1,1])
		input.push([1,0,0,0,0,0])

		let result = []
		result.push([{color: 1, elements: [0]}, {color: 0, elements: [1,2,3]},{color: 1, elements: [4,5]}])
		result.push([{color: 1, elements: [0,1,2]}, {color: 0, elements: [3]},{color: 1, elements: [4,5]}])
		result.push([{color: 1, elements: [0]}, {color: 0, elements: [1,2,3,4,5]}])

		expect(AppModule.findRunsHorizontal(input)).toEqual(result);
	});
});
