const { GRID_SIZE } = require('./costants');

function createGameState() {
    return {
        player: {
            pos: {
                x: 3,
                y: 1,
            },
            vel: {
                x: 1,
                y: 0
            },
            snake: [
                {x: 1, y: 1},
                {x: 2, y: 1},
                {x: 3, y: 1},
              ],
        },
        food: {
            x: 7,
            y: 7
        },
        gridSize: GRID_SIZE
    };

}

function gameLoop(state) {
    
    if (!state) {
        return;
    }
    // console.log('jere',state)
    const playerOne = state.player;
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE ||
        playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
        return 2;//player 2 wins
    }
    if (state.food.x === playerOne.pos.x &&
        state.food.y === playerOne.pos.y) { //check if sanke head at food
        playerOne.snake.push({ ...playerOne.pos })
       
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
       randomFruit(state)// as current food is eaten craete food
    }
    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            //if (JSON.stringify([playerOne.pos.x, playerOne.pos.y]) === JSON.stringify([cell.x, cell.y])) {
                if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {    
            // or simply playerOne.pos.x===cell.x &&playerOne.pos.y===cell.y
                //Head bumps to body, over
                return 2;
            }
            playerOne.snake.push({x:playerOne.pos.x,y:playerOne.pos.y});//new pos added in snake
            playerOne.snake.shift() ;//remove last pos cell of snake ,we want to remove last part only as one cell move per call;
            // as till now no one wins
            return false;
        }
    }
}

function randomFruit(state){
    food={
        x:Math.floor(Math.random() * GRID_SIZE),
        y:Math.floor(Math.random() * GRID_SIZE)
    }
    for(let cell of state.player.snake){
        if(cell.x=== food.x && cell.y===food.y){
          return  randomFruit(state); // recursive call to find food pos which will not be on snake
             
        }
    }

    state.food=food;
}
function getUpadatedVel(keyCode){
    console.log(keyCode)
    switch(keyCode){
        case 37:{
            return {x:-1,y:0};
        }
        case 38:{
            return {x:0,y:-1};
        }
        case 39:{
            return {x:1,y:0};
        }
        case 40:{
            return {x:0,y:1};
        }
    }
}

module.exports = {
    createGameState,
    gameLoop,
    getUpadatedVel
}