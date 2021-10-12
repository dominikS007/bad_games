import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { row, col, onMouseDown, onMouseUp, isVisited } = this.props;
		const extraClassName = isVisited
			? "node-clicked"
			: // : number
			  // ? "node-number"
			  "";

		return (
			<div
				id={`node-${row}-${col}`}
				className={`node ${extraClassName}`}
				onMouseDown={() => onMouseDown(row, col)}
				onMouseUp={() => onMouseUp()}
			></div>
		);
	}
}
