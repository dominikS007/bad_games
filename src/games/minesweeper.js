export function minesweeper(grid) {
	createMines(grid); //creates mines
	tileNumberAlocating(grid); //alocates the numbers the the nodes
	const wholeGrid = getGrid(grid); //just the whole grid
	listOfWhiteTiles(grid);

	return wholeGrid;
}

//the function that checks the nodes
function checkNearNodesMine(node, grid) {
	const { row, col } = node;
	const neighbourNodes = [];
	//center
	// if (col > 0) neighbourNodes.push(grid[row][col]);
	//top-left
	if (row > 0 && col > 0) neighbourNodes.push(grid[row - 1][col - 1]);
	//top
	if (row > 0) neighbourNodes.push(grid[row - 1][col]);
	//top-right
	if (row > 0 && col < grid[0].length - 1)
		neighbourNodes.push(grid[row - 1][col + 1]);
	//right
	if (col < grid[0].length - 1) neighbourNodes.push(grid[row][col + 1]);
	//bottom-right
	if (row < grid.length - 1 && col < grid[0].length - 1)
		neighbourNodes.push(grid[row + 1][col + 1]);
	//bottom
	if (row < grid.length - 1) neighbourNodes.push(grid[row + 1][col]);
	//bottom-left
	if (row < grid.length - 1 && col > 0)
		neighbourNodes.push(grid[row + 1][col - 1]);
	//left
	if (col > 0) neighbourNodes.push(grid[row][col - 1]);

	return neighbourNodes.filter(neighbourNodes => neighbourNodes.isMine);
}

//functions that checks the nodes around in a cross shape
export function checkNearNodesOnly(node, grid) {
	const { row, col } = node;
	const neighbourNodes = [];
	//top
	if (row > 0) neighbourNodes.push(grid[row - 1][col]);
	//right
	if (col < grid[0].length - 1) neighbourNodes.push(grid[row][col + 1]);
	//bottom
	if (row < grid.length - 1) neighbourNodes.push(grid[row + 1][col]);
	//left
	if (col > 0) neighbourNodes.push(grid[row][col - 1]);

	//only return the nodes that have not been visted
	return neighbourNodes.filter(neighbourNodes => !neighbourNodes.isVisited);
}

//random.math function for generation default was 25
function getRandomInt() {
	return Math.floor(Math.random() * Math.floor((25 / 265) * 100));
}

//generate mines
function createMines(grid) {
	const tiles = [];
	var mineCounter = [];
	for (const row of grid) {
		for (const node of row) {
			if (mineCounter.length < 40) {
				if (getRandomInt() === 1 || getRandomInt() === 2) {
					node.isMine = true;
					node.number = Infinity;
					mineCounter.push(node);
				}
			}
			tiles.push(node);
		}
	}
	//console.log(mineCounter.length);
	return tiles;

	//return tiles.filter(tiles => !tiles.isMine);
}

//gets the whole grid
function getGrid(grid) {
	const tiles = [];
	for (const row of grid) {
		for (const node of row) {
			tiles.push(node);
		}
	}
	return tiles;
}

//helper function for tileNumberAlocating
function checkForMine(number, node, grid) {
	let array = checkNearNodesMine(node, grid).length;
	if (array === number && node.isMine === false) {
		node.number = number;
	}
}

export function listOfMines(grid) {
	const listOfMines = [];
	const wholeGrid = getGrid(grid);

	while (!!wholeGrid.length) {
		const firstNode = wholeGrid.shift();
		if (firstNode.number === Infinity) {
			listOfMines.push(firstNode);
		}
	}
	return listOfMines;
}

//checks the tile around and corosponding to how many mines there is it assigns a value
function tileNumberAlocating(grid) {
	for (const row of grid) {
		for (const node of row) {
			for (let i = 0; i < 9; i++) {
				checkForMine(i, node, grid);
			}
		}
	}
}

//RETURNS A ARRAY OF TILES THAT HAS A NUMBER HIGHER THAN 0
export function listOfNumberedTiles(grid) {
	const listOfNumberTiles = [];
	const wholeGrid = getGrid(grid);

	while (!!wholeGrid.length) {
		const firstNode = wholeGrid.shift();
		if (firstNode.number >= 1 && firstNode.isMine === false) {
			listOfNumberTiles.push(firstNode);
		}
	}
	return listOfNumberTiles;
}

//function that returns a array of nodes that are 0's
function listOfWhiteTiles(grid) {
	//want to return the white spaces that dont have numbers in teh array
	const whiteSpaceNode = [];
	const wholeGrid = getGrid(grid);

	while (!!wholeGrid.length) {
		const firstNode = wholeGrid.shift();
		if (firstNode.number === 0) {
			whiteSpaceNode.push(firstNode);
		}
	}

	return whiteSpaceNode;
}

export function blankTileReveal(currentNode, grid) {
	const aroundWhiteTiles = [];
	const nodePressed = currentNode;

	for (const neighbours of checkNearNodesOnly(nodePressed, grid)) {
		neighbours.isVisited = true;
		for (const neighbourOfneighbour of neighbours.neighbours) {
			if (
				neighbourOfneighbour.number < 1 &&
				!neighbourOfneighbour.isVisited &&
				!neighbourOfneighbour.isMine
			) {
				aroundWhiteTiles.push(neighbourOfneighbour);
			}
		}
	}

	return aroundWhiteTiles;
}

// RETURNS A NODE, THAT IS NOT VISITED, MINE AND NUMBER
function directions(node, grid) {
	const { row, col } = node;
	const neighbourNodes = [];

	//pushes the node into a array if they satisfy the if condiction
	if (row < grid.length - 1) neighbourNodes.push(grid[row + 1][col]); //south
	if (row > 0) neighbourNodes.push(grid[row - 1][col]); //north
	if (col > 0) neighbourNodes.push(grid[row][col - 1]); //west
	if (col < grid[0].length - 1) neighbourNodes.push(grid[row][col + 1]); //east

	// console.log(neighbourNodes);

	//only returns the nodes that not visted, mines and numbers
	var filteredArray = neighbourNodes.filter(
		neighbourNodes => !neighbourNodes.isVisited && !neighbourNodes.isMine
	);

	//DEBUG
	// console.log(filteredArray);

	if (filteredArray.length > 0) {
		for (const nodesAv of filteredArray) {
			nodesAv.isVisited = true;
			return nodesAv;
		}
	} else {
		//DEBUG
		// console.log("returning null error");
		return null;
	}
}

//flood fill algorithm, is uses the same algorithm as the bucket in paint
//STILL DOES NOT WORK PROPERLY I DONT KNOW WHY NEED TO DEBUG BUT THAT WILL TAKE TIME
export function floodFill(clickedNode, grid) {
	const stack = [];
	let next, current;

	clickedNode.isVisited = true;
	stack.push(clickedNode);
	current = clickedNode;

	//when the only thing in the array is null it ends,
	//that when there is nothing else to uncover
	while (stack[0] !== null) {
		//EXEPTIONS (backtracking)
		while (current === null || current.number >= 1) {
			current = stack.pop();
		}
		//GET THE NEXT NODE
		next = directions(current, grid);
		//PUSH THE NEXT NODE
		stack.push(next);
		// SET THE NEXT NODE TO CURRENT NODE
		current = next;
	}

	// JUST TO MAKE THE ARRAY EMPTY
	if (stack.length === 1 && stack[0] === null) {
		stack.pop();
	}

	//DEBUG
	// console.log(stack[0]);
	// console.log(stack);
	// console.log(next);
	// console.log(current);
}