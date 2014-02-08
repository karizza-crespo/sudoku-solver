$(document).ready(function(){
/*===============================================================================================Classes====================================================================================================*/
	/**
		Classes:
			SolutionMatrix
			SudokuChecker
			SudokuSolver
	**/
	function SolutionMatrix (matrix, dimension) {
		this.dimension = dimension;
		this.matrix = new Array();
		
		for (var i=0; i<dimension*dimension; i++)
			this.matrix[i] = new Array();
		
		/**
			Constructor for SolutionMatrix
		**/
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				this.matrix[i][j] = matrix[i][j];
	}

	function SudokuChecker () {
		/**
			Method for checking if the input is already in the row, the column and the submatrix
		**/
		this.checkPerCell = function (matrix, dimension, row, col, input) {
			for (var i=0; i<dimension*dimension; i++) {
				if (input == matrix[row][i])
					return 0;
				if (input == matrix[i][col])
					return 0;
			}

			var rowFlag = 0;
			var colFlag = 0;
			var rowStart, rowEnd, colStart, colEnd;
				
			//get the submatrix where the cell belongs to
			for (i=0; i<dimension*dimension; i+=dimension) {
				if(row >= i && row < i+dimension) {
					rowStart = i;
					rowEnd = i+dimension;
					rowFlag = 1;
				}
				if(col >= i && col < i+dimension) {
					colStart = i;
					colEnd = i+dimension;
					colFlag = 1;
				}
				//if the start and end indices  of the submatrix are found, break
				if(rowFlag == 1 && colFlag == 1)
					break;
			}
			
			//check if the input is already in the submatrix
			for(i = rowStart; i<rowEnd; i++) {
				for(j = colStart; j<colEnd; j++) {
					if(input == matrix[i][j])
						return 0;
				}
			}
			//return 1 if the input is not yet in the matrix
			return 1;
		}
		

		/**
			Method for checking if the matrix is a solution for Sudoku
		**/
		this.checkSudoku = function (matrix, dimension) {
			numbersX = new Array();
			numbersY = new Array();
			
			//check if there are any present 0's in the matrix
			//if there are, sudoku is not a solution
			for (var i=0; i<dimension*dimension; i++) {
				for (var j=0; j<dimension*dimension; j++) {
					if (matrix[i][j] == 0) {
						/* free the array variables */
						numbersX = null;
						numbersY = null;
						
						return 0;
					}
				}
			}
		
			//initialize all the values in the arrays to 0
			for(var i = 0; i<dimension*dimension; i++) {
				numbersX[i] = 0;
				numbersY[i] = 0;
			}
			
			//check each row of the matrix
			for(var i = 0; i<dimension*dimension; i++) {
				for(var j = 0; j<dimension*dimension; j++)
					//increment the value in the array $numbers at index $matrix[$i][$j]-1
					numbersX[matrix[i][j]-1]++;
				
				//check $numbers if there are duplicates
				for(var j = 0; j<dimension*dimension; j++) {
					if(numbersX[j] != i+1) {
						/* free the array variables */
						for (var k=0; k<numbersX.length; k++) {
							numbersX[k] = null;
							numbersY[k] = null;
						}
						numbersX = null;
						numbersY = null;
						
						return 0;
					}
				}
			}
			
			//check each column of the matrix
			for(var i = 0; i<dimension*dimension; i++) {
				for(var j = 0; j<dimension*dimension; j++)
					//increment the value in the array $numbers at index $matrix[$i][$j]-1
					numbersY[matrix[j][i]-1]++;

				//check $numbers if there are duplicates
				for(var j = 0; j<dimension*dimension; j++) {
					if(numbersY[j] != i+1) {
						/* free the array variables */
						for (var k=0; k<numbersX.length; k++) {
							numbersX[k] = null;
							numbersY[k] = null;
						}
						numbersX = null;
						numbersY = null;
						
						return 0;
					}
				}
			}
			/* free the array variables */
			for (var k=0; k<numbersX.length; k++) {
				numbersX[k] = null;
				numbersY[k] = null;
			}
			numbersX = null;
			numbersY = null;
						
			return 1;
		}
		
		/**
			Method for checking if the matrix is a SudokuX Solution
		**/
		this.checkSudokuX = function (matrix, dimension) {
			numbersX1 = new Array();
			numbersX2 = new Array();
			
			//initialize all the values in the arrays to 0
			for(var i = 0; i<dimension*dimension; i++) {
				numbersX1[i] = 0;
				numbersX2[i] = 0;
			}
				
			//diagonal from left to right
			for(var i = 0; i<dimension*dimension; i++)
				numbersX1[matrix[i][i]-1]++;
			
			//if there are duplicates, return 0
			for(var i = 0; i<dimension*dimension; i++) {
				if(numbersX1[i] != 1) {
					/* free the array variables */
					for (var k=0; k<numbersX1.length; k++) {
						numbersX1[k] = null;
						numbersX2[k] = null;
					}
					numbersX1 = null;
					numbersX2 = null;
					
					return 0;
				}
			}
			
			//diagonal from right to left
			for(var i = 0; i<dimension*dimension; i++)
				for(var j = 0; j<dimension*dimension; j++)
					if (i+j == dimension*dimension-1)
						numbersX2[matrix[i][j]-1]++;
			
			//if there are duplicates, return 0
			for(var i = 0; i<dimension*dimension; i++) {
				if(numbersX2[i] != 1) {
					/* free the array variables */
					for (var k=0; k<numbersX2.length; k++) {
						numbersX1[k] = null;
						numbersX2[k] = null;
					}
					numbersX1 = null;
					numbersX2 = null;
					
					return 0;
				}
			}
			
			/* free the array variables */
			for (var k=0; k<numbersX1.length; k++) {
				numbersX1[k] = null;
				numbersX2[k] = null;
			}
			numbersX1 = null;
			numbersX2 = null;
			
			return 1;
		}
		
		/**
			Method for checking if the matrix is a SudokuY Solution
		**/
		this.checkSudokuY = function (matrix, dimension) {
			//sudokuY only works for odd-numbered matrices
			if ((dimension*dimension)%2 == 0)
				return 0;
			else {
				var midpoint = Math.floor((dimension*dimension)/2);

				var checker_array_left = new Array();
				var checker_array_right = new Array();

				for(var i = 0; i<dimension*dimension; i++) {
					checker_array_left[i] = 0;
					checker_array_right[i] = 0;
				}

				// Fill checker arrays with values from 1 to dimension^2
				for(var i=0; i<dimension*dimension; i++) {
					checker_array_left[i] = i+1;
					checker_array_right[i] = i+1;
				}

				// Analyze left wing ("\" + "|")
				for(var i=0; i<midpoint; i++)
					checker_array_left[matrix[i][i]-1] = 0;

				for(var i=midpoint; i<dimension*dimension; i++)
					checker_array_left[matrix[i][midpoint]-1] = 0;

				// Check for duplicates
				for(var i=0; i<dimension*dimension; i++) {
					if(checker_array_left[i] != 0) {
						/* free array variables */
						for (var k=0; k<checker_array_left.length; k++) {
							checker_array_left[k] = null;
							checker_array_right[k] = null;
						}
						checker_array_left = null;
						checker_array_right = null;
						
						return 0;
					}
				}

				// Analyze right wing ("/" + "|")
				for(var i = 0; i<dimension*dimension; i++) {
					for(var j = 0; j<dimension*dimension; j++) {
						if (i<midpoint) {
							if (i+j == dimension*dimension-1)
								checker_array_right[matrix[i][j]-1] = 0;
						}
					}
					if (i >= midpoint)
						checker_array_right[matrix[i][midpoint]-1] = 0;
				}

				// Check for duplicates
				for(var i=0; i<dimension*dimension; i++) {
					if(checker_array_right[i] != 0) {
						/* free array variables */
						for (var k=0; k<checker_array_left.length; k++) {
							checker_array_left[k] = null;
							checker_array_right[k] = null;
						}
						checker_array_left = null;
						checker_array_right = null;
						
						return 0;
					}
				}
				
				/* free array variables */
				for (var k=0; k<checker_array_left.length; k++) {
					checker_array_left[k] = null;
					checker_array_right[k] = null;
				}
				checker_array_left = null;
				checker_array_right = null;
		
				return 1;
			}
		}
	}

	function SudokuSolver (matrix, dimension) {
		
		this.checker = new SudokuChecker();
		
		/**
			Method for getting the solutions for the sudoku puzzle
		**/
		this.solveSudoku = function (sudokuSolutions, choice) {
			var cells = dimension*dimension;
			var counter = 0;
			var move = 0;
			var start = 0;
			
			numRows = Math.pow(dimension*dimension, 2)+2;
			numCols = (dimension*dimension)+2;
				
			var options = new Array();
			var tos = new Array();
			var coords = new Array();
			
			for (var i=0; i<numRows; i++)
				coords[i] = new Array();

			tos[start] = 1;
			
			for (var i=0; i<numRows; i++)
				options[i] = new Array();
			
			for (var i=0; i<numRows; i++)
				for (j=0; j<numCols; j++)
					options[i][j] = null;
			
			//save in the options array all the coordinates that has a 0 value in the puzzle
			for (var i=0; i<cells; i++) {
				for (var j=0; j<cells; j++) {
					if (matrix[i][j] == 0) {
						move = move + 1;
						coords[move][0] = i;
						coords[move][1] = j;
					}
				}
			}
			
			move = 0;
			while (tos[start] > 0) {
				if (tos[move] > 0) {
					//if the stack still has a value, input that value to the matrix
					if (options[move][tos[move]] != null)
						matrix[coords[move][0]][coords[move][1]] = options[move][tos[move]];
					
					move = move + 1;
					tos[move] = 0;
					
					//check if the sudoku is already a solution, if yes, add it to the sudokuSolutions array
					if (this.checker.checkSudoku(matrix, dimension) != 0) {
						if (choice == 1)
							sudokuSolutions[counter++] = new SolutionMatrix(matrix, dimension);
						else if (choice == 2) {
							//check if the solution is a sudokuX solution
							if (this.checker.checkSudokuX(matrix, dimension) != 0)
								sudokuSolutions[counter++] = new SolutionMatrix(matrix, dimension);
						}
						else if (choice == 3) {
							//check if the solution is a sudokuY solution
							if (this.checker.checkSudokuY(matrix, dimension) != 0)
								sudokuSolutions[counter++] = new SolutionMatrix(matrix, dimension);
						}
						else if (choice == 4) {
							//check if the solution is a sudokuXY solution
							if (this.checker.checkSudokuX(matrix, dimension) != 0)
								if (this.checker.checkSudokuY(matrix, dimension) != 0)
									sudokuSolutions[counter++] = new SolutionMatrix(matrix, dimension);
						}
					}
					else {
						//otherwise, check for possible inputs
						for (k=cells; k>=1; k--) {
							//check if the input is already in the matrix, if not, add it to the stack
							if (coords[move][0] != null) {
								if (this.checker.checkPerCell(matrix, dimension, coords[move][0], coords[move][1], k) != 0) {
									tos[move] = tos[move] + 1;
									options[move][tos[move]] = k;
								}
							}
						}
					}
				}
				else {
					//if there are no more possible inputs in the stack, move a step backward in the stack
					move = move - 1;
					options[move][tos[move]] = null;
					tos[move] = tos[move] - 1;
					//change the values back to zero
					if (move != 0)
						matrix[coords[move][0]][coords[move][1]] = 0;
				}
			}

			/* free all variables */
			options = null;
			
			for (var i=0; i<coords.length; i++) {
				coords[i][0] = null;
				coords[i][1] = null;
			}
			coords = null;
			
			for (var i=0; i<tos.length; i++)
				tos[i] = null;
			tos = null;
		}
	}
/*============================================================================================File Reader====================================================================================================*/
	var fileInput = document.getElementById('fileInput');
	var fileDisplayArea = document.getElementById('fileDisplayArea');
	var String;
	var problems = new Array();

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;

		if (file.type.match(textType)) {
			var reader = new FileReader();
			
			reader.onload = function(e) {
				var inputFile = reader.result.split("\n");
				var line,space;
				
				var numOfProblems = inputFile[0];
				var contents = "";
				
				line = 1;
				for (var i = 0; i<numOfProblems; i++) {
					var dimension = inputFile[line];
					var puzzle = new Array();
					//create the matrix for the sudoku puzzle
					for (var j = 0; j<dimension*dimension; j++)
						puzzle[j] = new Array();
					
					line = line + 1;
					for (var k = 0; k<dimension*dimension; k++) {
						var inputPuzzle = inputFile[line].split(" ");
						for (space = 0; space < inputPuzzle.length; space++)
							puzzle[k][space] = parseInt(inputPuzzle[space]);
						line = line + 1;
					}
					contents += '<button id="list'+i+'" class="buttonList" data-id="'+i+'" title="Show/Hide Puzzle">Puzzle '+(i+1)+'</button> <br />';
					contents += '<div class="problemContent" id="problemContent'+i+'"> ';
					contents += '<div id="sudokuPuzzle'+i+'" class="sudokuPuzzle" data-id="'+i+'" data-dimension="'+dimension+'"></div><br /> ';
					contents += '<div class="buttons"> ';
					contents += '<button id="solveSudokuButton'+i+'" class="solveSudokuButton" data-id="'+i+'" data-dimension="'+dimension+'">Solve Sudoku</button> ';
					contents += '<button id="solveSudokuXButton'+i+'" class="solveSudokuXButton" data-id="'+i+'" data-dimension="'+dimension+'">Solve SudokuX</button> ';
					contents += '<button id="solveSudokuYButton'+i+'" class="solveSudokuYButton" data-id="'+i+'" data-dimension="'+dimension+'">Solve SudokuY</button> ';
					contents += '<button id="solveSudokuXYButton'+i+'" class="solveSudokuXYButton" data-id="'+i+'" data-dimension="'+dimension+'">Solve SudokuXY</button> ';
					contents += '</div> ';
					contents += '<div id="sudokuSolutions'+i+'" class="sudokuSolutions" data-id="'+i+'" data-dimension="'+dimension+'"></div> ';
					contents += '</div>';
					
					problems.push(puzzle);
				}
				$('#content').html(contents);
				$('.problemContent').hide();
				for (var ctr=0; ctr<problems.length; ctr++) {
					$('#sudokuPuzzle'+ctr).html(function() {
						var id = $(this).attr('data-id');
						var dimension = $(this).attr('data-dimension');
							
						var puzzleTable = "<table class='puzzle'>";
						for (var m=0; m<dimension*dimension; m++) {
							puzzleTable += "<tr>";
							for (var n=0; n<dimension*dimension; n++) {
								puzzleTable += "<td>";
								if (problems[id][m][n] != 0)
									puzzleTable += problems[id][m][n];
								else
									puzzleTable += " ";
								puzzleTable += "</td>";
							}
							puzzleTable += "</tr>";
						}
						puzzleTable += "</table>";
						
						return puzzleTable;
					});
				}
			}
			reader.readAsText(file);
		}
		else {
			alert('File is not acceptable.');
		}
	});
	
	//solve for sudoku solutions
	$('#content').on('click', '.solveSudokuButton', function(){
		var id = $(this).attr('data-id');
		var dimension = parseInt($(this).attr('data-dimension'));
		
		console.log('id: '+id);
		console.log('dimension: '+dimension);
		
		var sudokuSolutions = new Array();
			
		//this matrix would be the one modified when solving the puzzle
		var sudokuPuzzle = new Array();

		//create the matrix for the sudoku puzzle
		for (var i = 0; i<dimension*dimension; i++)
			sudokuPuzzle[i] = new Array();
		
		//assign the value per cell of the initial puzzle to another matrix
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = problems[id][i][j];
		
		//create an instance of the SudokuSolver
		var solver = new SudokuSolver(sudokuPuzzle, dimension);
		
		//call the sudokuSolver method
		solver.solveSudoku(sudokuSolutions, 1);
		
		//check if there are no solutions
		if (sudokuSolutions.length == 0)
			$('#sudokuSolutions'+id).html('<h1>No Solutions.</h1>');
		else {
			//if there are solutions, print all the solutions
			$('#sudokuSolutions'+id).html(function() {
				var solutions = "<h1>Sudoku Solution(s): </h1>";
				if (sudokuSolutions.length == 1)
					solutions += "<h2> There is " + sudokuSolutions.length + " solution.</h2>";
				else
					solutions += "<h2> There are " + sudokuSolutions.length + " solutions.</h2>";
				for (var k=0; k<sudokuSolutions.length; k++) {
					solutions += "<table class='solutions'>";
					for (i=0; i<dimension*dimension; i++) {
						solutions += "<tr>";
						for (j=0; j<dimension*dimension; j++)
							solutions += "<td>" + sudokuSolutions[k].matrix[i][j] + "</td>";
						solutions += "</tr>";
					}
					solutions += "</table>";
				}
				return solutions;
			});
		}

		/* free the variables */
		for (var i=0; i<sudokuSolutions.length; i++)
			sudokuSolutions[i] = null;
		sudokuSolutions = null;
		
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = null;
		sudokuPuzzle = null;
	});
	
	//solve for sudokuX solutions
	$('#content').on('click', '.solveSudokuXButton', function(){
		var id = $(this).attr('data-id');
		var dimension = parseInt($(this).attr('data-dimension'));
		
		console.log('id: '+id);
		console.log('dimension: '+dimension);
		
		var sudokuSolutions = new Array();
			
		//this matrix would be the one modified when solving the puzzle
		var sudokuPuzzle = new Array();

		//create the matrix for the sudoku puzzle
		for (var i = 0; i<dimension*dimension; i++)
			sudokuPuzzle[i] = new Array();
		
		//assign the value per cell of the initial puzzle to another matrix
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = problems[id][i][j];
		
		//create an instance of the SudokuSolver
		var solver = new SudokuSolver(sudokuPuzzle, dimension);
		
		//call the sudokuSolver method
		solver.solveSudoku(sudokuSolutions, 2);
		
		//check if there are no solutions
		if (sudokuSolutions.length == 0)
			$('#sudokuSolutions'+id).html('<h1>No Solutions.</h1>');
		else {
			//if there are solutions, print all the solutions
			$('#sudokuSolutions'+id).html(function() {
				var solutions = "<h1>Sudoku X Solution(s): </h1>";
				if (sudokuSolutions.length == 1)
					solutions += "<h2> There is " + sudokuSolutions.length + " solution.</h2>";
				else
					solutions += "<h2> There are " + sudokuSolutions.length + " solutions.</h2>";
				for (var k=0; k<sudokuSolutions.length; k++) {
					solutions += "<table class='solutions'>";
					for (i=0; i<dimension*dimension; i++) {
						solutions += "<tr>";
						for (j=0; j<dimension*dimension; j++) {
							if (i == j || i+j == dimension*dimension-1)
								solutions += "<td class='special'>" + sudokuSolutions[k].matrix[i][j] + "</td>";
							else
								solutions += "<td>" + sudokuSolutions[k].matrix[i][j] + "</td>";
						}
						solutions += "</tr>";
					}
					solutions += "</table>";
				}
				return solutions;
			});
		}
		
		/* free the variables */
		for (var i=0; i<sudokuSolutions.length; i++)
			sudokuSolutions[i] = null;
		sudokuSolutions = null;
		
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = null;
		sudokuPuzzle = null;
	});
	
	//solve for sudokuY solutions
	$('#content').on('click', '.solveSudokuYButton', function(){
		var id = $(this).attr('data-id');
		var dimension = parseInt($(this).attr('data-dimension'));
		
		console.log('id: '+id);
		console.log('dimension: '+dimension);
		
		var sudokuSolutions = new Array();
			
		//this matrix would be the one modified when solving the puzzle
		var sudokuPuzzle = new Array();

		//create the matrix for the sudoku puzzle
		for (var i = 0; i<dimension*dimension; i++)
			sudokuPuzzle[i] = new Array();
		
		//assign the value per cell of the initial puzzle to another matrix
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = problems[id][i][j];
		
		if ((dimension*dimension)%2 == 0)
			$('#sudokuSolutions'+id).html('<h1>No Solutions.</h1>');
		else {
			//create an instance of the SudokuSolver
			var solver = new SudokuSolver(sudokuPuzzle, dimension);
			
			//call the sudokuSolver method
			solver.solveSudoku(sudokuSolutions, 3);
			
			//check if there are no solutions
			if (sudokuSolutions.length == 0) {
				$('#sudokuSolutions'+id).html('<h1>No Solutions.</h1>');
			}
			else {
				//if there are solutions, print all the solutions
				$('#sudokuSolutions'+id).html(function() {
					var midpoint = Math.floor((dimension*dimension)/2);
					var solutions = "<h1>Sudoku Y Solution(s): </h1>";
					if (sudokuSolutions.length == 1)
						solutions += "<h2> There is " + sudokuSolutions.length + " solution.</h2>";
					else
						solutions += "<h2> There are " + sudokuSolutions.length + " solutions.</h2>";
					for (var k=0; k<sudokuSolutions.length; k++) {
						solutions += "<table class='solutions'>";
						for (i=0; i<dimension*dimension; i++) {
							solutions += "<tr>";
							for (j=0; j<dimension*dimension; j++) {
								if (i<midpoint) {
									if (i == j || i+j == dimension*dimension-1)
										solutions += "<td class='special'>" + sudokuSolutions[k].matrix[i][j] + "</td>";
									else
										solutions += "<td>" + sudokuSolutions[k].matrix[i][j] + "</td>";		
								}
								else {
									if (j == midpoint)
										solutions += "<td class='special'>" + sudokuSolutions[k].matrix[i][j] + "</td>";
									else
										solutions += "<td>" + sudokuSolutions[k].matrix[i][j] + "</td>";
								}
							}
							solutions += "</tr>";
						}
						solutions += "</table>";
					}
					return solutions;
				});
			}
		}
		
		/* free the variables */
		for (var i=0; i<sudokuSolutions.length; i++)
			sudokuSolutions[i] = null;
		sudokuSolutions = null;
		
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = null;
		sudokuPuzzle = null;
	});
	
	//solve for sudokuXY solutions
	$('#content').on('click', '.solveSudokuXYButton', function(){
		var id = $(this).attr('data-id');
		var dimension = parseInt($(this).attr('data-dimension'));
		
		console.log('id: '+id);
		console.log('dimension: '+dimension);
		
		var sudokuSolutions = new Array();
			
		//this matrix would be the one modified when solving the puzzle
		var sudokuPuzzle = new Array();

		//create the matrix for the sudoku puzzle
		for (var i = 0; i<dimension*dimension; i++)
			sudokuPuzzle[i] = new Array();
		
		//assign the value per cell of the initial puzzle to another matrix
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = problems[id][i][j];
		
		if ((dimension*dimension)%2 == 0)
			$('#sudokuSolutions'+id).html('<h1>No Solutions.</h1>');
		else {
			//create an instance of the SudokuSolver
			var solver = new SudokuSolver(sudokuPuzzle, dimension);
			
			//call the sudokuSolver method
			solver.solveSudoku(sudokuSolutions, 4);
			
			//check if there are no solutions
			if (sudokuSolutions.length == 0)
				$('#sudokuSolutions'+id).html('<h1>No Solutions.</h1>');
			else {
				//if there are solutions, print all the solutions
				$('#sudokuSolutions'+id).html(function() {
					var midpoint = Math.floor((dimension*dimension)/2);
					var solutions = "<h1>Sudoku XY Solution(s): </h1>";
					if (sudokuSolutions.length == 1)
						solutions += "<h2> There is " + sudokuSolutions.length + " solution.</h2>";
					else
						solutions += "<h2> There are " + sudokuSolutions.length + " solutions.</h2>";
					for (var k=0; k<sudokuSolutions.length; k++) {
						solutions += "<table class='solutions'>";
						for (i=0; i<dimension*dimension; i++) {
							solutions += "<tr>";
							for (j=0; j<dimension*dimension; j++) {
								if (i == j || i+j == dimension*dimension-1)
									solutions += "<td class='special'>" + sudokuSolutions[k].matrix[i][j] + "</td>";
								else if (i >= midpoint && j == midpoint)
									solutions += "<td class='special'>" + sudokuSolutions[k].matrix[i][j] + "</td>";
								else
									solutions += "<td>" + sudokuSolutions[k].matrix[i][j] + "</td>";
							}
							solutions += "</tr>";
						}
						solutions += "</table>";
					}
					return solutions;
				});
			}
		}
			
		/* free the variables */
		for (var i=0; i<sudokuSolutions.length; i++)
			sudokuSolutions[i] = null;
		sudokuSolutions = null;
		
		for (var i=0; i<dimension*dimension; i++)
			for (var j=0; j<dimension*dimension; j++)
				sudokuPuzzle[i][j] = null;
		sudokuPuzzle = null;
	});
	$('#content').on('click', '.buttonList', function(){
		var id = $(this).attr('data-id');
		$('#problemContent'+id).slideToggle('slow');
	});
});
/*============================================================================================================================================================================================================*/