var waitingPlayers = [];
var games = []; //Dicionário onde chave = idDaSala e valor = objeto Game

//Express é um framework que permite implementar um webServer ao lidar com as requisições HTTP
var express = require('express');
var app = express();
var server = require('http').Server(app);
app.use(express.static("public"));

//A socket.io gerencia o uso de sockets
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    io.to(socket.id).emit("login", socket.id);
    waitingPlayers.push(socket);
    
    while (waitingPlayers.length >= 3) {

        var roomName = "" + (games.length + 1);

        var roomPlayers = waitingPlayers.splice(0, 3);

        for (player of roomPlayers) {
            player.join(roomName);
        }

        var game = newGame();
        games[roomName] = game;
        
        io.to(roomName).emit("test", game);

    }

    socket.on('play', function (line) {
        
        var roomName = this.rooms[1];
        var game = games[roomName];
        game.addLine(line);
        
        var data = [];
        data["line"] = line;
        data["game"] = game;
        io.to(roomName).emit("play", data);
    
        if (checkGameover()){
            //Checar quem ganhou
            //data = jogador
            //io.to(roomName).emit("gameover", data);   
        }
    
    });

    socket.on('disconnect', function () {
        //O que será feito caso ele se desconecte.
    });

});

server.listen(80);

function newGame(){}
function checkGameover(){}