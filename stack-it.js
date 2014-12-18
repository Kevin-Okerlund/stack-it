var columns = 9;
var rows = 12;
var startingSpeed = 500;
var endingSpeed = 100;

// Output to the console (I'll be using this a lot)
function $c(content) {
	console.log(content);
}

/*
createTable
Creates a table in an element
@param {string} elementId	Supply an element id, but not the element itself
@param {number} columns		Number of columns the table will have
@param {number} rows		Number of rows the table will have
@returns {element} table	Appends a table onto the provided element
*/
function createTable(elementId) {
	var grid = document.getElementById(elementId);
	var table = document.createElement('table');
	// I'm going to start these loops at 1 as it will make more sense for rows and columns
	for (var r = 1; r < rows + 1; r++) {
		var tr = document.createElement('tr');
		tr.id = 'r' + r;
		for (var c = 1; c < columns + 1; c++) {
			var td = document.createElement('td');
			td.id = 'r' + r + 'c' + c
			tr.appendChild(td)
		}
		table.appendChild(tr);
	}
	grid.appendChild(table);
}

function handleCellSize() {
	$c('Inner Width: ' + window.innerWidth);
	$c('Inner Height: ' + window.innerHeight);
	
	var maxCellSize = Math.floor(window.innerHeight / rows);
	$c('Maximum Cell Size: ' + maxCellSize);
	$c('The table should be: ' + maxCellSize * columns);
	
	if (columns * maxCellSize > window.innerWidth) {
		$c('Basing height off of width instead');
		maxCellSize = Math.floor(window.innerWidth / columns);
	}
	
	var cells = document.getElementsByTagName('td');
	for (var i = 0; i < cells.length; i++) {
    	cells[i].style.width = maxCellSize + 'px';
		cells[i].style.height = maxCellSize + 'px';
	}
}

window.addEventListener('load', function() {
	createTable('grid');
	handleCellSize();
});