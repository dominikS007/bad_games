
import React, { Component } from "react";
import Node from "./Node/Node";

import {
	minesweeper,
	listOfMines,
	listOfNumberedTiles,
	floodFill
} from "../games/minesweeper";

import "./Stage.css";

//Create the Grid size, (row = x , col = y)
const GRID_ROW = 16;
const GRID_COL = 16;

//const array of colors to the numbers *****TO BE ADDED****
// const numberColors = [];

export default class Stage extends Component {
	constructor() {
		super();
		this.state = {
			grid: [],
			mouseIsPressed: false
		};
	}

	//creates the grid, pre defined functions name, invoked immediately after a component is mounted
	componentDidMount() {
		const grid = initialGrid();
		this.setState({ grid });
	}

	minesweeper() {
		const { grid } = this.state;
		const wholegrid = minesweeper(grid);
		this.showMines(wholegrid);
	}

	/*
		mouse events, the function names are built in the react; Mouse Event
	*/

	//if mouse is pressed down
	handleMouseDown(row, col) {
		const grid = this.state.grid;
		const node = grid[row][col];
		//DEBUG
		console.log(node);

		//if the user presses the mine
		for (const mines of listOfMines(grid)) {
			if (row === mines.row && col === mines.col) {
				//alert("Game Over :/");
				console.log("Game Over :/");
				document.getElementById(`node-${row}-${col}`).className =
					"node node-mine";
				mines.isVisited = true;
			}
		}

		//if the user presses a tile that is a number
		for (const numberNodes of listOfNumberedTiles(grid)) {
			if (row === numberNodes.row && col === numberNodes.col) {
				// DEBUG
				// console.log(numberNodes.number);
				for (let i = 0; i < 9; i++) {
					if (numberNodes.number === i) {
						document.getElementById(
							`node-${numberNodes.row}-${numberNodes.col}`
						).innerHTML = i;
						numberNodes.isVisited = true;
					}
				}
			}
		}

		//cycle through the whole grid to check for visted nodes
		// for (const nodesInGrid of grid) {
		// 	if (nodesInGrid.isVisited === true && nodesInGrid.number === 0) {
		// 		document.getElementById(`node-${row}-${col}`).className =
		// 			"node node-clicked";
		// 	}
		// }

		//IF THE TILE PRESSED IS 0 REVEAL THE 0'S, ELSE JUST NUMBER
		if (node.number <= 0) {
			floodFill(node, grid);
		}
	}

	//when the mouse btn is unpressed
	handleMouseUp() {
		this.setState({ mouseIsPressed: false });
		const grid = this.state.grid;

		/*
			this is added here because it look off when with the animation,
			would of been added in the pressed down event but the numbers appered
			before the clearence of the floodfill 
		*/
		// IF NODES IS VISTED BUT HAS NUMBER ADD NUMBERS
		for (const checking of listOfNumberedTiles(grid)) {
			if (checking.isVisited === true) {
				for (let i = 0; i < 9; i++) {
					if (checking.number === i) {
						document.getElementById(
							`node-${checking.row}-${checking.col}`
						).innerHTML = i;
					}
				}
			}
		}
	}

	showMines(wholegrid) {
		for (let i = 0; i < wholegrid.length; i++) {
			const node = wholegrid[i];
			if (node.isMine === true) {
				document.getElementById(
					`node-${node.row}-${node.col}`
				).className = "node node-mine";
			}
		}
	}

	render() {
		const { grid } = this.state;
		return (
			<div>
				<div className="Games-List">
					<button onClick={() => this.minesweeper()}>
						Minesweeper Game
					</button>
				</div>

				<div className="Grid">
					{grid.map((row, rowIdx) => {
						return (
							<div key={rowIdx}>
								{row.map((node, nodeIdx) => {
									const {
										row,
										col,
										isVisited,
										number
									} = node;
									return (
										<Node
											key={nodeIdx}
											row={row}
											col={col}
											isVisited={isVisited}
											number={number}
											onMouseDown={(row, col) =>
												this.handleMouseDown(row, col)
											}
											onMouseUp={() =>
												this.handleMouseUp()
											}
										></Node>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
//how the grid is created
const initialGrid = () => {
	const grid = [];
	for (let row = 0; row < GRID_ROW; row++) {
		const currentRow = [];
		for (let col = 0; col < GRID_COL; col++) {
			currentRow.push(createNode(row, col));
		}
		grid.push(currentRow);
	}
	return grid;
};

//object of a nod and the properties
const createNode = (row, col) => {
	return {
		row,
		col,
		isMine: false,
		number: 0,
		isVisited: false,
		isFlaged: false
	};
};
