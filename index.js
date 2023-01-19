// /32.49
// require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.use(express.static('assets'));

const { startGame, gameLoop, getUpadatedVel } = require('./config/game')
const { FRAME_RATE } = require('./config/costants')
const{ makeid}=require('./config/makeIdController');
const state = {};
const clientRooms = {};


const io = require('socket.io')();
io.on('connection', socket => {

    socket.on('keydown', handleKeydown);//any key is press
    socket.on('newGame', handleNewGame);
    socket.on('joinGame', handleJoinGame);

    function handleJoinGame(roomName){
        const room=io.sockets.adapter.rooms[roomName];
        let allUsers;
        if(room){
            allUsers=room.sockets;
        }
        
        let numOfClients=0;
        if(allUsers){
            numOfClients=Object.keys(allUsers).length;
        }
        if(numOfClients === 0){
           socket.emit('unknownGame');
           return;
        }else if(numOfClients>1){
            socket.emit('roomSizeExceed'); //already 2 players joined
           return;
        }
        clientRooms[socket.id]=roomName;
        console.log('join n',room,allUsers,clientRooms[socket.id])
        socket.join(roomName);
        socket.number=2;
        socket.emit('start',2);
        startGameInterval(roomName);
    }

    function handleNewGame() {
        let roomName = makeid(5);
        clientRooms[socket.id] = roomName;
        socket.emit('gameCode', roomName);
        state[roomName] = startGame();
        console.log('newgm',state[roomName])
        socket.join(roomName);
        socket.number=1;
        socket.emit('start',1) ;

    }
    function handleKeydown(keyCode) {
        // console.log(keyCode,'key pressed')
        const roomName=clientRooms[socket.id];
        if(!roomName){
            return;
        }
        try {
            keyCode = parseInt(keyCode);
        } catch (err) {
            console.log(err);
            return;
        }
        const vel = getUpadatedVel(keyCode);
        if (vel) {
            state[roomName].players[socket.number - 1].vel=vel; //substract one as we need zero based indexing for arry
            //state.player.vel = vel; //old for single player
        }
    }
  //  startGameInterval(socket, state); commented after addding multiplayer fun , this line causes imediate starting of game

});
function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]);

        if (!winner) {// game is on/running
           
           // socket.emit('gameState', JSON.stringify(state)) old used for single player
           emitGameState(roomName,state[roomName]);
        } else {
            //socket.emit('gameOver');
            emitGameOver(roomName,winner);
            state[roomName]=null;// as game over reset room
            clearInterval(intervalId);
            
        }
    }, 1000 / FRAME_RATE); //ms to wait per frame
}
function emitGameState(room, gameState){
    io.sockets.in(room)
    .emit('gameState',JSON.stringify(gameState))
}
function emitGameOver(room,winner){
    io.sockets.in(room)
    .emit('gameOver',JSON.stringify({winner})) // {} to say as object
}







io.listen(3000, console.log(`server listening on port 3000`))

app.get('/', function (req, res) {
    res.sendFile('index.html');
});


const start = async () => {

    try {

        //await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`server listening on port ${port}`))
    } catch (error) {
        console.log(error);
    }
}
start()