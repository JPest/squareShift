var waitingPlayers = [];
var games = [];

//ServeStatic e connect disponibilizam uma pasta como pública, para a exibição dos htmls
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic("public")).listen(80);

//Express é um framework que permite implementar um webServer ao lidar com as requisições HTTP
var app = require('express')();
var server = require('http').Server(app);

//A socket.io gerencia o uso de sockets
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log(waitingPlayers.length);
    waitingPlayers.push(socket);

    if (waitingPlayers.length >= 3) {

        var roomName = "" + (games.length + 1);

        var roomPlayers = waitingPlayers.splice(0, 3);

        for (player of players) {
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


server.listen(3000);