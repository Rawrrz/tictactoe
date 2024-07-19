

function Gameboard()
{
    // Define rows and columns the board has
    const rows = 3;
    const columns = 3;

    // Define the board array
    const board = [];

    const loadBoard = () =>
    {
        // Load the board with cells
        for(let i = 0; i < rows; i++)
            {
                board[i] = [];
                for(let j = 0; j < columns; j++)
                    board[i].push(Cell());
            }
    }

    // Define a method to return the board
    const getBoard = () => board;

    // Define a method to place marker into the board
    const placeMarker = (row, col, player) =>
    {
        // If cell is taken simply return
        if(board[row][col].getMarker() !== '.') return;

        // If cell is not taken place marker
        board[row][col].addMarker(player);
    };

    // Define a method to print the board
    const printBoard = () =>
    {
        // Define a new 2D array with just the markers of the cells
        const boardWithCellMarkers = board.map((rows) => rows.map((cell) => cell.getMarker()));

        // Print the new 2D array
        console.log(boardWithCellMarkers);
    }

    // Define a method to get the print board
    const getPrintBoard = () =>
    {
        // Define a new 2D array with just the markers of the cells
        const boardWithCellMarkers = board.map((rows) => rows.map((cell) => cell.getMarker()));

        return boardWithCellMarkers;
    }
    

    // Return defined methods
    return { loadBoard, getBoard, placeMarker, printBoard, getPrintBoard };
}

// Define a cell that will be in a board square that returns a method to placeMarker and getMarker
function Cell()
{
    // Define marker the cell has (Default marker is '.')
    let marker = '.';

    // Define method that marks the cell using a player marker
    const addMarker = (player) =>
    {
        marker = player;
    }

    // Define a method that gets the value of the cell
    const getMarker = () => marker;

    // Return the defined methods
    return {addMarker, getMarker};
}

// Define a controller for the game that takes in Player1 and Player2 names
function GameController(playerOneName = "Player One", playerTwoName = "Player Two")
{
    // Define a gameboard
    const board = Gameboard();

    // Load the board
    board.loadBoard();

    // Define two players for game
    const players = [
        {
            name: playerOneName,
            marker: 'X'
        },
        {
            name: playerTwoName,
            marker: 'O'
        }
    ];

    // Set the active player
    let activePlayer = players[0];

    // Define a function to switch the active player
    const switchPlayerTurn = () =>
    {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // Define a function to return the active player
    const getActivePlayer = () => activePlayer;

    // Define a function to print a new round
    const printNewRound = () =>
    {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    // Function to check for win
    const checkForWin = (player) =>
    {
            let marker = player.marker;
            const grid = board.getPrintBoard();
            // Check rows
            for(let i = 0; i < grid.length; i++)
            {
                if (grid[i][0] === marker && grid[i][1] === marker && grid[i][2] === marker) {
                    return true;
                }
            }
    
            // Check cols
            for(let i = 0; i < grid.length; i++)
            {
                if(grid[0][i] === marker && grid[1][i] === marker && grid[2][i] === marker)
                    return true;
            }
    
            // Check diags
            if(grid[0][0] === marker && grid[1][1] === marker && grid[2][2] === marker)
                    return true;
            else if(grid[2][0] === marker && grid[1][1] === marker && grid[0][2] === marker)
                    return true;
            
            return false;
    };

    // Check for a tie
    const checkForTie = () =>
    {
        const grid = board.getPrintBoard();

        if(!checkForWin(getActivePlayer()))
        {
            for(let i = 0; i < grid.length; i++)
                for(let j = 0; j < grid[i].length; j++)
                {
                    if(grid[i][j] === '.')
                        return false;
                }
            return true;
        }
    }

    // Define a function to play a round which takes in a column and and drops a token based on column
    const playRound = (row, column) =>
    {
        // Drop a token for the activePlayer
        console.log(`Placing ${getActivePlayer().name}'s marker onto row: ${row+1}, column: ${column+1}.`);
        board.placeMarker(row, column, getActivePlayer().marker);
    
        // CHECK FOR WINNER LOGIC HERE
        if(checkForWin(getActivePlayer()))
        {
            console.log(`${getActivePlayer().name} wins the game!`);
        }
        else
        {
            // Switch player turn
            switchPlayerTurn();
            printNewRound();
        }
    };

    // Initial play game message
    printNewRound();

    // Return the defined game methods
    return { players, playRound, getActivePlayer, getBoard: board.getBoard, checkForWin, resetBoard: board.loadBoard, checkForTie};
}

// Define function to control the screen
function ScreenController()
{
    // Create a game controller
    const game = GameController();

    // Get player output div
    const playerOutput = document.querySelector('.playerOutput');
    // Get board div
    const boardDiv = document.querySelector('#board');

    // Get restart button
    const restart = document.querySelector('.restart');

    // Define a function to update the screen
    const updateScreen = () =>
    {
        // clear the board div
        boardDiv.textContent = "";

        // get the most recent board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display the player's turn
        if(game.checkForWin(game.getActivePlayer()))
            playerOutput.textContent = `${activePlayer.name} Wins!`;
        else
            playerOutput.textContent = `${activePlayer.name}'s turn`;

        if(game.checkForTie())
        {
            playerOutput.textContent = "It's a tie!"
        }



        // Render board squares
        board.forEach((row, rowIndex) =>
        {
            row.forEach((cell, colIndex) =>
            {
                // Create cell
                const cellButton = document.createElement("div");
                // Assign the class
                cellButton.classList.add("cell");

                // Define data labels for user input
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;

                // Set contents of cellButtons
                cellButton.textContent = cell.getMarker() === '.' ? "" : cell.getMarker();

                // Add it to board div
                boardDiv.appendChild(cellButton);
            })
        })
    };


    // Add event listener for the board
    function clickHandlerBoard(e)
    {
        // Define a selected row and column
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // Make sure it's not a gap
        if(!selectedColumn || !selectedRow) return;

        // Play a round with selected row and col
        game.playRound(selectedRow, selectedColumn);

        // Update the screen
        updateScreen();
    }

    // Add event listener to board
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Adad reset button event listener
    restart.addEventListener("click", () =>
    {
        game.resetBoard();
        updateScreen();
        game.getActivePlayer() = game.players[0];
    });

    // Initial render
    updateScreen();
}

// Call the screen controller
ScreenController();
