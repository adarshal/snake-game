const[bgCl,canvasCl,snakeCl,foodCl]=["#1a4971","black","green","yellow"];
let canvas,context;

const socket= io('http://localhost:3000',{cors: {origin: "*"}});

socket.on('init',handleSocket);
socket.on('gamaeState',handleGameState);


const gameState={
    player:{
        pos:{
            x:5,
            y:10
        },
        vel:{
            x:1,
            y:0
        },
        snake:[
            {x:1, y:10},
            {x:2,y:10},
            {x:3,y:10},
        ]
    },
    food:{
        x:7,
        y:7
    },
    gridSize:20
};



function start(){
    canvas=document.getElementById('canvas');
    context=canvas.getContext("2d");
    context.fillStyle=bgCl;
    canvas.height=canvas.width=600;
    context.fillRect(0,0,canvas.width,canvas.height);

    document.addEventListener('keydown', todo);
}

function todo(e){
    console.log(e.keyCode);
    paintGame(gameState)
}

// socket fun 
function handleSocket(msg){
    console.log(msg)
}

function handleGameState(gameState){
    gameState=JSON.parse(gameState);
    requestAnimationFrame(()=>{
            paintGame(gameState)
    });  
}


function paintGame(state){
    context.fillStyle=bgCl;
    context.fillRect(0,0,canvas.width,canvas.height);
    const food=state.food;
    const gridSize=state.gridSize;
    const size=canvas.width/gridSize;

    context.fillStyle=foodCl;
    context.fillRect(food.x*size, food.y*size,size,size);

    paintPlayer(state.player,size);

}

function paintPlayer(player,size){
    const snake=player.snake;
    context.fillStyle=snakeCl;

    for(let cell of snake){
        context.fillRect(cell.x*size, cell.y*size,size,size)
    }
}




start();