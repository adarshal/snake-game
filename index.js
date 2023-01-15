// /32.49
// require('dotenv').config();

const express=require('express');
const app=express();
const port=process.env.PORT || 8000;

app.use(express.static('assets'));

const {createGameState,gameLoop,getUpadatedVel}=require('./config/game')
const {FRAME_RATE}=require('./config/costants')




const io=require('socket.io')();
io.on('connection', socket => {
    const state=createGameState();

    socket.on('keydown', handleKeydown);
    socket.on('newGame', handleNewGame);
    socket.on('joinGame', handleJoinGame);

    function handleNewGame(){
        let roomName=makeId(5);
    }
    function handleKeydown(keyCode){
       // console.log(keyCode,'key pressed')
        try {
            keyCode=parseInt(keyCode);
        } catch (err) {
            console.log(err);
            return;
        }
        const vel=getUpadatedVel(keyCode);
        if(vel){
            state.player.vel=vel;
        }
    }
    startGameInterval(socket,state);

  });
function startGameInterval(socket,state){
    const intervalId=setInterval(()=>{
        const winner=gameLoop(state);
        
        if(!winner){// game is on/running
            socket.emit('gameState',JSON.stringify(state)) 
            
        }else{
            socket.emit('gameOver');
            clearInterval(intervalId);
        }
    },1000/FRAME_RATE); //ms to wait per frame
}








 io.listen(3000,console.log(`server listening on port 3000`)) 
 
app.get('/',function(req,res) {
    res.sendFile('index.html');
  });


const start= async ()=>{
   
    try {
        
        //await connectDB(process.env.MONGO_URI);
       app.listen(port,console.log(`server listening on port ${port}`)) 
    } catch (error) {
        console.log(error);
    }
}
start()