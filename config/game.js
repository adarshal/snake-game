const { GRID_SIZE } = require('./costants');

function createGameState() {
    return {
        player: {
            pos: {
                x: 5,
                y: 10
            },
            vel: {
                x: 1,
                y: 0
            },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 },
            ]
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
    const playerOne = state.player;
    playerOne.pos.x *= playerOne.vel.x;
    playerOne.pos.y *= playerOne.vel.y;
    if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE ||
        playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
        return 2;//player 2 wins
    }
    if (state.food.x === playerOne.pos.x &&
        state.food.y === playerOne.pos.y) { //check if sanke head at food
        playerOne.snake.push({ ...playerOne.pos })
        playerOne.pos.x *= playerOne.vel.x;
        playerOne.pos.y *= playerOne.vel.y;
        randomFruit()// as current food is eaten craete food
    }
}


module.exports = {
    createGameState,
    gameLoop
}