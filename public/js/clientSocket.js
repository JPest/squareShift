var socket = io();
var userID = "";

socket.on("login", function (socketID) {
    userID = socketID;
    alert(userID);
});

socket.on("play", function (data) {
    drawLine(data["line"]);
    
    if (data["game"].nextPlayer == userID){
        enableCanvas();
    }
    else{
        disableCanvas();
    }
});

socket.on("gameover", function (socketID) {
    endingAnimation();
});

function endingAnimation(){}
function drawLine(line){}
function enableCanvas(){}
function disableCanvas(){}