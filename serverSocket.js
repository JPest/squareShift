var waitingPlayers = [];
var games = [];

//ServeStatic e connect disponibilizam uma pasta como pública, para a exibição dos htmls
var serveStatic = require('serve-static');
var express = require('express');
//connect().use(express.static("public")).listen(80);

//Express é um framework que permite implementar um webServer ao lidar com as requisições HTTP
var app = express();
var server = require('http').Server(app);
app.use(express.static("public"));


//A socket.io gerencia o uso de sockets
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log(waitingPlayers.length);
    waitingPlayers.push(socket);

    if (waitingPlayers.length >= 3) {

        var roomName = "" + (games.length + 1);

        var roomPlayers = waitingPlayers.splice(0, 3);

        for (player of roomPlayers) {
            player.join(roomName);
        }

        //var game = newGame();
        //games.push(game);
        io.to(roomName).emit("test", "Teste de envio de mensagem");

    }

    socket.on('play', function (data) {
        //O que será feito quando o jogador criar uma linha
        //
        //game.addLine(data);
    });

    socket.on('disconnect', function () {
        //O que será feito caso ele se desconecte.
    });

});

server.listen(80);