const [bgCl, canvasCl, snakeCl, foodCl] = ["#1a4971", "black", "green", "yellow"];
let GRID_SIZE=10;

let canvas, context,playerNumber;
let gameActive=false;
const socket = io('http://localhost:3000', { cors: { origin: "*" } });

window.addEventListener('blur',()=>{
    document.title='Resume Playing'
});
window.addEventListener('focus',()=>{
    document.title='Snake Game'
});

socket.on('start', handleSocket);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownGame', handleUnknownGame);
socket.on('roomSizeExceed', handleroomSizeExceede);

const gameDiv=document.getElementById('game');
const initialScreen=document.getElementById('initialScreen');
const newGameBtn=document.getElementById('newGameButton');
const joinBtn=document.getElementById('joinGameButton');
const gameCodeInput=document.getElementById('gameCodeInput');
const gameCodeDis=document.getElementById('gameCodeDis');

newGameBtn.addEventListener('click',newGame);
joinBtn.addEventListener('click',joinGame);

function newGame(){
    socket.emit('newGame')
    start();
}
function joinGame(){
    const code=gameCodeInput.value;
    socket.emit('joinGame',code)
    start();
}

const gameState = {
   players: [{
    pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 1,
        y: 0,
      },
      snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
      ],
    }, {
      pos: {
        x: 18,
        y: 10,
      },
      vel: {
        x: 0,
        y: 0,
      },
      snake: [
        {x: 20, y: 10},
        {x: 19, y: 10},
        {x: 18, y: 10},
      ],
    }],
    food: {},
    gridsize: GRID_SIZE,
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
    gameActive=true;
}

function todo(e) {
    console.log(e.keyCode);
    socket.emit('keydown', e.keyCode);

}




function paintGame(state) {
    context.fillStyle = bgCl;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const food = state.food;
    const gridSize = state.gridsize;
    const size = canvas.width / gridSize;
   console.log(food.x,food.y,size,'fdgdfgd')

    context.fillStyle = foodCl;
    context.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size,'red');
    paintPlayer(state.players[1], size,'cyan');

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
function handleSocket(number) {
    // console.log(msg)
    playerNumber=number
}

function handleGameState(gameState) {
   // console.log(gameState)
   if(!gameActive){
    return;
}
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => {
        paintGame(gameState)
    });
}

function handleGameOver(data){
    if(!gameActive){
        return;
    }
    data=JSON.parse(data);
    if(data.winner === playerNumber){
        alert('you win');
        return;
    }
    alert('game over, you lost');
    gameActive=false;
}
function handleGameCode(gameCode){
    gameCodeDis.innerHTML=gameCode;
}
function handleUnknownGame(){
  reset();
  alert('game code not found')
}
function handleroomSizeExceede(){
    reset();
    alert('game is already in progress')
}

function reset(){
     playerNumber=null;
     gameCodeInput.value="";
     gameCodeDis.innerHTML="";
     initialScreen.style.display=block;
     gameDiv.style.display=none;
}

// start();