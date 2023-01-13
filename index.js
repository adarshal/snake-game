
// require('dotenv').config();

const express=require('express');
const app=express();
const port=process.env.PORT || 8000;

app.use(express.static('assets'));

const {createGameState,gameLoop}=require('./config/game')
const {FRAME_RATE}=require('./config/costants')




const io=require('socket.io')();
io.on('connection', socket => {
    const state=createGameState();
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