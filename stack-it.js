/*
$c
Output to the console (I get tired of writing "console.log()")
$param {anything}
*/
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
function createTable(elementId, columns, rows) {
	var grid = document.getElementById(elementId);
	var table = document.createElement('table');
	// I'm going to start these loops at 1 as it will make more sense for rows and columns
	for (var r = 1; r < rows + 1; r++) {
		var tr = document.createElement('tr');
		for (var c = 1; c < columns + 1; c++) {
			var td = document.createElement('td');
			// For now just output the row and column into the table cell
			// We will get to assigning unique ids later
			td.appendChild(document.createTextNode('R: ' + r + ' C: ' + c));
			tr.appendChild(td)
		}
		table.appendChild(tr);
	}
	grid.appendChild(table);
}

window.addEventListener('load', function() {
	createTable('grid', 9, 12);
});