const { GRID_SIZE } = require('./costants');

function startGame(){
    const state=createGameState();
    randomFruit(state);
    return state;
}

// function createGameState() { //old for single player
//     return {
//         player: {
//             pos: {
//                 x: 3,
//                 y: 1,
//             },
//             vel: {
//                 x: 1,
//                 y: 0
//             },
//             snake: [
//                 {x: 1, y: 1},
//                 {x: 2, y: 1},
//                 {x: 3, y: 1},
//               ],
//         },
//         food: {
//             x: 7,
//             y: 7
//         },
//         gridSize: GRID_SIZE
//     };
// }
function createGameState() {
    return {
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
  }

  
function gameLoop(state) {
    
    if (!state) {
        return;
    }
    // console.log('jere',state)
    const playerOne = state.players[0];
    const playerTwo = state.players[1];
    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;
    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;
    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE ||
        playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
        return 2;//player 2 wins
    }
    if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE ||
        playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
        return 1;//player 1 wins
    }
    if (state.food.x === playerOne.pos.x &&
        state.food.y === playerOne.pos.y) { //check if sanke head at food
        playerOne.snake.push({ ...playerOne.pos })
       
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
       randomFruit(state)// as current food is eaten craete food
    }
    if (state.food.x === playerTwo.pos.x &&
        state.food.y === playerTwo.pos.y) { //check if sanke head at food
        playerTwo.snake.push({ ...playerTwo.pos })
       
        playerOne.pos.x += playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;
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
        }
            playerOne.snake.push({x:playerOne.pos.x,y:playerOne.pos.y});//new pos added in snake
            playerOne.snake.shift() ;//remove last pos cell of snake ,we want to remove last part only as one cell move per call;
            //  till now no one wins
    } 
    if (playerTwo.vel.x || playerTwo.vel.y) {
        for (let cell of playerTwo.snake) {
             if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {    
                return 1;
            }
        }
            playerTwo.snake.push({x:playerTwo.pos.x,y:playerTwo.pos.y});//new pos added in snake
            playerTwo.snake.shift() ;//remove last pos cell of snake ,we want to remove last part only as one cell move per call;
            //  till now no one wins
        }
        return false;
}

function randomFruit(state){
    food={
        x:Math.floor(Math.random() * GRID_SIZE),
        y:Math.floor(Math.random() * GRID_SIZE)
    }
    for(let cell of state.players[0].snake){
        if(cell.x=== food.x && cell.y===food.y){
          return  randomFruit(state); // recursive call to find food pos which will not be on snake
             
        }
    }
    for(let cell of state.players[1].snake){
        if(cell.x=== food.x && cell.y===food.y){
          return  randomFruit(state); // recursive call to find food pos which will not be on snake
             
        }
    }

    state.food=food;
}
function getUpadatedVel(keyCode){
   // console.log(keyCode)
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
    startGame,
    gameLoop,
    getUpadatedVel
}