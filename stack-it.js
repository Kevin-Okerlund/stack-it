// STILL NEEDS REFACTORING
// SOME CODE IS USED MANY TIMES

var LOG = function(content) {console.log(content)} // I'll save a few keystrokes in my lifetime ;)
// Add a search function for arrays
Array.prototype.contains = function(needle) {
	for (i in this) {
		if (this[i] === needle) return true;
	}
	return false;
}
// All of the game data
var game = {
	columns: 7,
	rows: 15,
	startingSpeed : 180,
	endingSpeed : 40,
	selector: 'body',
	incrementingSpeed: null,
	currentSpeed: null,
	direction: 'right',
	cellCount: 3,
	activeRow: null,
	activeCells: [],
	lastCell: null,
	startTwoCells: null,
	startOneCell: null,
	stack: [],
	playing: true,
	keydown: false,
	showIds: false
}
// Any variables that need to be reset each time a new game starts
var resetVars = function() {
	game.currentSpeed = game.startingSpeed;
	game.cellCount = 3,
	game.activeRow = game.rows;
	game.activeCells = [];
	game.stack = [];
	game.playing = true;
	
}
// The initial loading function that runs when the page loads
var init = function() {
	calculateVars();
	createGrid();
	handleCellSize();
	newGame();
}
// Depending upon the size of the board, yes... it can be dynamic, calculate some things
var calculateVars = function() {
	game.incrementingSpeed = Math.floor((game.startingSpeed - game.endingSpeed) / game.rows);
	game.currentSpeed = game.startingSpeed;
	game.twoCells = game.rows - (game.rows / 3);
	game.oneCell = game.rows - (game.rows / 3) * 2;
	game.activeRow = game.rows;
	game.startTwoCells = Math.ceil(game.rows * 0.70);
	game.startOneCell = Math.ceil(game.rows * 0.35);
}
// Create the board on the screen. This will only create HTML and no styles
var createGrid = function() {
	var grid = document.querySelector(game.selector);
	var table = document.createElement('table');
	for (var r = 1; r < game.rows + 1; r++) {
		var tr = document.createElement('tr');
		tr.id = 'r' + r;
		for (var c = 1; c < game.columns + 1; c++) {
			var td = document.createElement('td');
			td.id = 'r' + r + 'c' + c;
			if (game.showIds) { td.appendChild(document.createTextNode(td.id)); } 
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	grid.appendChild(table);
}
// Change the cell sizes to make the grid fit the screen
// Styles are applied here
var handleCellSize = function() {
	var maxCellSize = Math.floor(window.innerHeight / game.rows);
	if (game.columns * maxCellSize > window.innerWidth) {
		maxCellSize = Math.floor(window.innerWidth / game.columns);
	}
	var cells = document.getElementsByTagName('td');
	for (var i = 0; i < cells.length; i++) {
    	cells[i].style.width = maxCellSize + 'px';
		cells[i].style.height = maxCellSize + 'px';
	}
}
// There's a few things that need to be updated when we start a new game
var newGame = function() {
	resetVars();
	clearBoard();
	selectRowCells();
	setDirection();
	timer();
}
// Apply some styling to all cells to reset the board
var clearBoard = function() {
	var cells = document.getElementsByTagName('td');
	for (var i = 0; i < cells.length; i++) {
		cells[i].className = 'inactiveCell';
	}
}
// Select some cells at random for placement on the board
var selectRowCells = function() {
	game.activeCells = [];
	var startingCell = Math.floor(Math.random() * ((game.columns - game.cellCount + 1) - 1 + 1)) + 1;
	for (var i = 0; i < game.cellCount; i++) {
		game.activeCells.push(startingCell + i);
	}
}
// Depending on where the cells are generated, we may need to change from the initial direction
var setDirection = function() {
	if (game.activeCells[game.activeCells.length - 1] == game.columns) {
		game.direction = 'left';
	}
	if (game.activeCells[0] == 1) {
		game.direction = 'right';
	}
}
// The heart of the game
// This powers the movement and painting of the board on a timer
var timer = function() {
	if (game.playing) {
		move();
		paintGrid();
		setTimeout(timer, game.currentSpeed);
	}
}
// Calulates the next move for the cells
var move = function() {
	if (game.direction == 'right') {
		var nextCell = game.activeCells[game.activeCells.length - 1] + 1;
		if (nextCell <= game.columns) {
			game.activeCells.push(nextCell);
			game.lastCell = game.activeCells.shift();
		}
		if (nextCell == game.columns) {
			game.direction = 'left';
		}
	}
	else if (game.direction == 'left') {
		var nextCell = game.activeCells[0] - 1;
		if (nextCell >= 1) {
			game.activeCells.unshift(nextCell);
			game.lastCell = game.activeCells.pop();
		}
		if (nextCell == 1) {
			game.direction = 'right';
		}
	}
}
// Paints the cells down
// Also removes the style where the cells were
var paintGrid = function() {
	for (var i = 0; i < game.activeCells.length; i++) {
		document.getElementById('r' + game.activeRow + 'c' + game.activeCells[i]).className = 'activeCell';
	}
	if (game.lastCell) {
		document.getElementById('r' + game.activeRow + 'c' + game.lastCell).className = 'inactiveCell';
	}
}
// Where we check if our tower is actually being created correclty
var checkRules = function() {
	if (game.activeRow == game.rows) {
		game.stack.push(game.activeCells);
		moveRows();
	}
	else if (game.activeRow < game.rows) {
		var part1 = game.activeCells;
		var part2 = game.stack[game.stack.length - 1];
		var validCells = [];
		for (var i = 0; i < part1.length; i++) {
			if (part2.contains(part1[i])) {
				validCells.push(part1[i]);
			}
			else {
				LOG('Dropped cell: r' + game.activeRow + 'c' + part1[i]);
				document.getElementById('r' + game.activeRow + 'c' + part1[i]).className = 'invalidCell';
			}
		}
		
		game.cellCount = validCells.length;
		if (game.activeRow - 1 == game.startTwoCells && game.cellCount > 2) {
			game.cellCount = 2;
		}
		if (game.activeRow - 1 == game.startOneCell) {
			game.cellCount = 1;
		}
		if (!validCells.length) {
			LOG('*** GAME OVER: NO VAILD CELLS REMAINING ***');
			game.playing = false;
		}
		if (game.activeRow == 1 && validCells.length) {
			LOG('*** CONGRATULATIONS! ***');
			game.playing = false;
		}
		else {
			moveRows();
		}
		game.stack.push(validCells);
	}
}
// Depending on where we are at on the board, move up rows when keyed
var moveRows = function() {
	game.activeRow -= 1;
	selectRowCells();
	setDirection();
	game.currentSpeed -= game.incrementingSpeed;
}
// Handles the keydown / touchstart methods
var keyTouchDown = function() {
	if (game.keydown) {
       	return;
    }
	game.keydown = true;
	if (game.playing) {
		checkRules();
	}
	else {
		LOG('\n*** STARTING A NEW GAME ***');
		newGame();
	}
}
// Handles the keyup / touchend methods
var keyTouchUp = function() {
	game.keydown = false;
}

// Handle events on a computer
window.addEventListener('keydown', keyTouchDown);
window.addEventListener('keyup', keyTouchUp);

// Handle events on a touch device
window.addEventListener('touchstart', keyTouchDown);
window.addEventListener('touchend', keyTouchUp);
