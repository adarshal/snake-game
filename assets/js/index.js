const [bgCl, canvasCl, snakeCl, foodCl] = ["#1a4971", "black", "green", "yellow"];
let canvas, context;

const socket = io('http://localhost:3000', { cors: { origin: "*" } });

socket.on('init', handleSocket);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);

const gameDiv=document.getElementById('game');
const initialScreen=document.getElementById('initialScreen');
const newGameBtn=document.getElementById('newGameButton');
const joinBtn=document.getElementById('joinGameButton');

newGameBtn.addEventListener('click',newGame);
joinBtn.addEventListener('click',joinGame);

function newGame(){
   
    socket.emit('newGame')
    start();
}
function joinGame(){
    const code=gameCodeInput.value;
    socket.emit('newGame')
    start();
}

const gameState = {
    player: {
        pos: {
            x: 3,
            y: 10
        },
        vel: {
            x: 1,
            y: 0,
        },
        snake: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
        ]
    },
    food: {
        x: 7,
        y: 7
    },
    gridSize: 10
};



function start() {
    initialScreen.style.display='none';
    gameDiv.style.display='block';
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    context.fillStyle = bgCl;
    canvas.height = canvas.width = 600;
    context.fillRect(0, 0, canvas.width, canvas.height);
    paintGame(gameState)
    document.addEventListener('keydown', todo);
}

function todo(e) {
    console.log(e.keyCode);
    socket.emit('keydown', e.keyCode);

}




function paintGame(state) {
    context.fillStyle = bgCl;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;
   // console.log(size,'fdgdfgd')

    context.fillStyle = foodCl;
    context.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.player, size,'red');

}

function paintPlayer(player, size, color) {
    const snake = player.snake;
    context.fillStyle = color;

    for (let cell of snake) {
       // console.log(cell);
        //context.fillStyle = snakeCl;
        context.fillRect(cell.x * size, cell.y * size, size, size)
    }
}
// socket fun 
function handleSocket(msg) {
    console.log(msg)
}

function handleGameState(gameState) {
   // console.log(gameState)
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => {
        paintGame(gameState)
    });
}

function handleGameOver(){
    alert('game over')
}


// start();