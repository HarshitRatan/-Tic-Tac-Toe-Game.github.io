const n = 3;
const winCondition = 3;
const gameBoard = Array.from({length: n}, () =>
                   Array.from({length: n}, () => 0));
var player = 1;

var Owin=0;
var Xwin=0;

function sleep(ms)
{
 const date = Date.now();
 let currentDate = null;
 do
 {
     currentDate = Date.now();
 }while(currentDate - date < ms);
}

function restart() 
{
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) 
    {
        cells[i].textContent = '';
        cells[i].addEventListener('click', cellClick, false);
    }
    player = 1;
    gameBoard.forEach(arr => arr.fill(0));
    AI = document.getElementById('AI-sel').value;
    document.getElementById('win-label').innerHTML = `__________________________________`;
}

function cellClick(cell) 
{
    play(cell.target.id);
    if (AI == 'true') 
    {
        const aiResult = minmax(gameBoard, 0, player);
        const cellId = `c${aiResult.row}${aiResult.col}`;
        play(cellId);
    }
}

function play(cellId) 
{
    const cell = document.getElementById(cellId);
    if (cell.textContent === '') 
    {
        const pattern = player === 1 ? 'O' : 'X';
        cell.textContent = pattern;                
        const row = parseInt(cellId.charAt(1));
        const col = parseInt(cellId.charAt(2));
        writeBoard(row, col);
        checkBoard(row, col);
        switchTurn();     
    }

}

function writeBoard(row, col) 
{
    gameBoard[row][col] = player;
}

function switchTurn() 
{
    if (player === 1)
    {
        player = -1;
    } 
    else 
    {
        player = 1;
    }
}

function checkBoard(row, col) 
{
    let winner = null;
    const state = gameState(gameBoard, player, row, col);
    if (state) 
    {
        winner = player === 1 ? 'O' : 'X';
        endGame(winner);
    } 
    else if (state === null) 
    {
        endGame(null);
    }
}

function gameState(board, player, row, col) {
    let diag1 = 0;
    let diag2 = 0;
    // check all board if not pass in last turn play
    if (row === undefined && col === undefined) {
        for (let i = 0; i < n; i++) {
            let ver = 0;
            let hor = 0;
            for (let j = 0; j < n; j++) {
                ver += board[j][i];
                hor += board[i][j];
            }
            if (ver === player * winCondition || hor === player * winCondition) {
                return true;
            }
        }
        for (let i = 0; i < n; i++) {
            //check diagonal
            diag1 += board[i][i];
            diag2 += board[i][n - 1 - i];
        }
        if (diag1 === player * winCondition || diag2 === player * winCondition) {
            return true;
        } else if (board.every(arr => arr.every(n => n !== 0))) {
            return null;
        } else {
            return false;
        }
    } else {
        // check vertical
        //check horizontal
        let ver = 0;
        let hor = 0;
        for (let i = 0; i < n; i++) {
            ver += board[i][col];
            hor += board[row][i];
            //check diagonal
            diag1 += board[i][i];
            diag2 += board[i][n - 1 - i];
        }
        if (ver === player * winCondition || hor === player * winCondition || diag1 === player * winCondition || diag2 === player * winCondition) {
            return true;
        } else if (board.every(arr => arr.every(n => n !== 0))) {
            return null;
        } else {
            return false;
        }
    }
}

function endGame(winner) 
{
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) 
    {
        cells[i].removeEventListener('click', cellClick);
    }
    if(AI == 'true')
    {
        if (winner !== null) 
        {
            sleep(200);
            document.getElementById('win-label').innerHTML = `Better Luck Next Time!`;
            setTimeout(() => alert(`Better Luck Next Time!`), 200);
            if(winner == 'X')
            {
                document.getElementById('xWin').innerHTML = `Computer = ${++Xwin}`;
            }
            if(winner == 'O')
            {
                document.getElementById('oWin').innerHTML = `Your Score = ${++Owin}`;
            }

    
        } else 
        {
            sleep(200);
            document.getElementById('win-label').innerHTML = `It's a Tie`;
            setTimeout(() => alert(`It's a Tie`), 200);
        }    

    }
    else
    {
        if (winner !== null) 
        {
            sleep(200);
            document.getElementById('win-label').innerHTML = `Congratulations! Player ${winner} WON`;
            setTimeout(() => alert(`Congratulations! Player ${winner} WON`), 200);
            console.log(winner);
            if(winner == 'X')
            {
                document.getElementById('xWin').innerHTML = `X Win = ${++Xwin}`;
            }
            if(winner == 'O')
            {
                document.getElementById('oWin').innerHTML = `O Win = ${++Owin}`;
            }
    
        } else 
        {
            sleep(200);
            document.getElementById('win-label').innerHTML = `It's a Tie`;
            setTimeout(() => alert(`It's a Tie`), 200);
        }    

    }
   }

function minmax(board, depth, player) {
    // check state of last move by last player, so we have to flip player
    const state = gameState(board, player === 1 ? -1 : 1);
    if (state) 
    {
        // game win go here
        // if this turn player is -1 (AI), then last turn is 1 (Human)
        return player === -1 ? depth - 10 : 10 - depth;
    } 
    else if (state === null) 
    {
        return 0;
    } 
    else 
    {
        let moves = [];
        for (let i = 0; i < n; i++) 
        {
            for (let j = 0; j < n; j++) 
            {
                // clone the board
                const calcBoard = board.map(arr => Array.from(arr));
                if (calcBoard[i][j] === 0) 
                {
                    calcBoard[i][j] = player;
                    const value = minmax(calcBoard, depth + 1, player === 1 ? -1 : 1);
                    moves.push({
                        cost: value,
                        cell: {
                            row: i,
                            col: j
                        }
                    });
                }
            }
        }
        if (player === -1) 
        {
            const max = moves.reduce((a, b) => a.cost > b.cost ? a : b);
            if (depth === 0) 
            {
                return max.cell;
            } 
            else 
            {
                return max.cost;
            }
        } 
        else 
        {
            const min = moves.reduce((a, b) => a.cost < b.cost ? a : b);
            if (depth === 0) 
            {
                return min.cell;
            } 
            else 
            {
                return min.cost;
            }
        }
    }
}

function control()
{
    Xwin=0;
    Owin=0;
    if(document.getElementById('AI-sel').value == 'true')
    {
        document.getElementById('xWin').innerHTML = `Computer = 0`;
        document.getElementById('oWin').innerHTML = `Your Score = 0`;
    }
    if(document.getElementById('AI-sel').value == 'false')
    {
        document.getElementById('xWin').innerHTML = `X win = 0`;
        document.getElementById('oWin').innerHTML = `O win = 0`;
    }
    restart();
}
restart();