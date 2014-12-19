var game = {
	columns: 9,
	rows: 12,
	startingSpeed : 260,
	endingSpeed : 40,
	selector: 'body',
	calc: {
		incrementingSpeed: null,
		currentSpeed: null,
		twoCells: null,
		oneCell: null
	},
	active: {
		row: null,
		cells: [],
		lastCell: null,
		right: true
	},
	tower: []
}

var createGame = function() {
	calculateVars();
	createGrid();
	handleCellSize();
	startGame();
}

var calculateVars = function() {
	game.calc.incrementingSpeed = Math.floor((game.startingSpeed - game.endingSpeed) / game.rows);
	game.calc.currentSpeed = game.startingSpeed;
	game.calc.twoCells = game.rows - (game.rows / 3);
	game.calc.oneCell = game.rows - (game.rows / 3) * 2;
}

var createGrid = function() {
	
	var grid = document.querySelector(game.selector);
	
	var table = document.createElement('table');
	for (var r = 1; r < game.rows + 1; r++) {
		var tr = document.createElement('tr');
		tr.id = 'r' + r;
		for (var c = 1; c < game.columns + 1; c++) {
			var td = document.createElement('td');
			td.id = 'r' + r + 'c' + c
			tr.appendChild(td)
		}
		table.appendChild(tr);
	}
	grid.appendChild(table);
}

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

var startGame = function() {
	selectRowCells(game.rows);
	paintGrid();
	bounce();
}

var selectRowCells = function(row) {
	game.active.row = row;
	game.active.cells = [];
	var activeCount;
	if (row <= game.calc.oneCell) {
		activeCount = 1;
	}
	if (row > game.calc.oneCell && row <= game.calc.twoCells) {
		activeCount = 2;
	}
	if (row > game.calc.twoCells) {
		activeCount = 3;
	}
	var startingCell = Math.floor(Math.random() * ((game.columns - activeCount + 1) - 1 + 1)) + 1;
	for (var i = 0; i < activeCount; i++) {
		game.active.cells.push(startingCell + i);
	}
}

var bounce = function() {
	if (game.active.cells[game.active.cells.length - 1] == game.columns) {
		game.active.right = false;
	}
	setInterval(function(){
		if (game.active.right) {
			var nextCell = game.active.cells[game.active.cells.length - 1] + 1;
			if (nextCell <= game.columns) {
				game.active.cells.push(nextCell);
				game.active.lastCell = game.active.cells.shift();
			}
			if (nextCell == game.columns) {
				game.active.right = false;
			}
		}
		else if (!game.active.right) {
			var nextCell = game.active.cells[0] - 1;
			if (nextCell >= 1) {
				game.active.cells.unshift(nextCell);
				game.active.lastCell = game.active.cells.pop();
			}
			if (nextCell == 1) {
				game.active.right = true;
			}
		}
		paintGrid();
	}, game.calc.currentSpeed);
}

var paintGrid = function() {
	for (var i = 0; i < game.active.cells.length; i++) {
		document.getElementById('r' + game.active.row + 'c' + game.active.cells[i]).className = 'activeCell';
	}
	if (game.active.lastCell) {
		document.getElementById('r' + game.active.row + 'c' + game.active.lastCell).className = 'inactiveCell';
	}
}
