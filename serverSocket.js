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

    socket.on('play', function (line) {

        var data = [];
        var roomName = this.gameRoom;
        var game = games[roomName];

        newRoundHandler(game, line);

        var numberOfSquares = 0;

        for (lineOfSquares of game.squares) {
            for (square of lineOfSquares) {
                numberOfSquares++;
            }
        }

        if (game.filledSquareCount == numberOfSquares) {
            var winningPlayer;
            var highScore = 0;

            for (player of game.players) {
                if (player.score > highScore) {
                    winningPlayer = player;
                    highScore = player.score;
                }
            }

            io.to(roomName).emit("gameover", winningPlayer);

        } else {
            data["game"] = game;
            data["line"] = line;

            io.to(roomName).emit("play", {
                game: game,
                line: line
            });
        }

    });

    socket.on('disconnect', function () {
        var index = waitingPlayers.indexOf(this);
        if (index >= 0) {
            waitingPlayers.pop(index);
        }

        game = games[this.gameRoom];

        if (game) {
            var outPlayer = undefined;
            for (player of game.players) {
                if (player.id == socket.id) {
                    outPlayer = game.players.pop(player);
                }

                if (game.roundPlayer = outPlayer) {

                    if (game.roundPlayerIndex >= game.players.length - 1) {
                        game.roundPlayerIndex = 0;
                    } else {
                        game.roundPlayerIndex++;
                    }

                    game.roundPlayer = game.players[game.roundPlayerIndex];

                }


            }

            io.to(this.gameRoom).emit("playerOut", {
                game: game,
                player: outPlayer
            });
        }


    });

    while (waitingPlayers.length >= 3) {

        var roomName = "" + (games.length + 1);

        var roomPlayers = waitingPlayers.splice(0, 3);

        var newGame = createNewGame();
        newGame.id = roomName;

        colorCount = 0;
        for (player of roomPlayers) {
            player.join(roomName);
            player.gameRoom = roomName;
            var serverPlayer = new Player();
            serverPlayer.id = player.id;

            switch (colorCount) {
            case 0:
                serverPlayer.color = "red";
                break;
            case 1:
                serverPlayer.color = "green";
                break;
            case 2:
                serverPlayer.color = "blue";
                break;
            }
            colorCount++;
            newGame.players.push(serverPlayer);
        }

        newGame.roundPlayer = newGame.players[newGame.roundPlayerIndex];

        games[roomName] = newGame;

        io.to(roomName).emit("startGame", newGame);

    }

});

server.listen(80);

function createNewGame() {

    var newGame = {
        squares: [], //Quadrados aqui
        lines: {},
        points: [],
        filledSquareCount: 0,
        players: [], //Jogadores aqui
        roundPlayer: "none",
        roundPlayerIndex: 0,
    };

    newGame.points = createPoints();
    newGame.lines = createLines(newGame.points);
    newGame.squares = createSquares(newGame.points, newGame.lines);

    return newGame;
}

function createPoints() {
    var points = []
    var lineArray = [];
    auxY = 0;
    for (j = 70; j <= 560; j += 100) {
        var auxX = 0;
        for (i = 300; i <= 900; i += 100) {
            var new_point = new Point(i, j);
            new_point.matrixX = auxX;
            new_point.matrixY = auxY;
            auxX++;
            lineArray.push(new_point);
        }
        points.push(lineArray);
        lineArray = [];
        auxY++;
    }
    return points;
}

function createLines(points) {

    lines = {};

    for (i = 0; i < points.length; i++) {
        for (j = 0; j < points[i].length; j++) {

            if (j != points[i].length - 1) { //Pontos que não são da última coluna
                var line = new Line(points[i][j], points[i][j + 1]); //Cria-se uma linha à direita
                lines[name(line)] = line;
            }
            if (i != points.length - 1) { //Pontos que não são da última linha
                var line = new Line(points[i][j], points[i + 1][j]); //Cria-se uma linha para baixo
                lines[name(line)] = line;
            }
        }
    }

    return lines;
}

function createSquares(points, lines) {
    var squares = [];
    var squareLineArray = [];
    auxY = 0;
    for (i = 0; i < points.length - 1; i++) {
        var auxX = 0;
        for (j = 0; j < points[i].length - 1; j++) {

            var newSquare = new Square();

            newSquare.points.push(points[i][j]);
            newSquare.points.push(points[i][j + 1]);
            newSquare.points.push(points[i + 1][j]);
            newSquare.points.push(points[i + 1][j + 1]);

            newSquare.lines.push(lines[lineName(newSquare.points[0], newSquare.points[1])]); //i,j - i, j+
            newSquare.lines.push(lines[lineName(newSquare.points[0], newSquare.points[2])]); //i,j - i+, j
            newSquare.lines.push(lines[lineName(newSquare.points[1], newSquare.points[3])]); //i,j+ - i+, j+
            newSquare.lines.push(lines[lineName(newSquare.points[2], newSquare.points[3])]); //i+,j - i+, j+

            squareLineArray.push(newSquare);

            newSquare.matrixX = auxX;
            newSquare.matrixY = auxY;

            auxX++;

        }

        squares.push(squareLineArray);
        squareLineArray = [];
        auxY++;



    }

    return squares;

}

function name(line) {
    return lineName(line.point1, line.point2);
}

function lineName(point1, point2) {

    var lineOrientation = "";

    var firstPoint = point1;
    var secondPoint = point2;

    if (point1.y == point2.y) {
        lineOrientation = "horizontal";
    } else {
        lineOrientation = "vertical";
    }

    if (lineOrientation == "horizontal") {
        if (point1.x > point2.x) {
            firstPoint = point2;
            secondPoint = point1;
        }
    } else {

        if (point1.y > point2.y) {
            firstPoint = point2;
            secondPoint = point1;
        }

    }

    return "" + firstPoint.x + "," + firstPoint.y + " - " + secondPoint.x + "," + secondPoint.y;

}

function checkFilledSquare(game, line) {
    var filledSquares = [];

    for (lineOfSquares of game.squares) {
        for (square of lineOfSquares) {
            var filledCount = 0;
            var hasLine = false;
            for (squareLine of square.lines) {

                if (squareLine.filled == true) {
                    filledCount++;
                }

                if (name(squareLine) == name(line)) {
                    hasLine = true;
                }
            }

            if (filledCount == 4 && hasLine) {
                filledSquares.push(square);
            }
        }
    }

    return filledSquares;
}

function newRoundHandler(game, line) {

    game.lines[name(line)].filled = true;

    var filledSquares = checkFilledSquare(game, line)

    if (filledSquares.length == 0) {

        if (game.roundPlayerIndex >= game.players.length - 1) {
            game.roundPlayerIndex = 0;
        } else {
            game.roundPlayerIndex++;
        }

        game.roundPlayer = game.players[game.roundPlayerIndex];

    } else {

        game.roundPlayer.score += filledSquares.length;
        game.filledSquareCount += filledSquares.length;

        io.to(game.id).emit("score", {
            player: game.roundPlayer,
            squares: filledSquares
        });

    }

}

function Square() {
    this.filled = false;
    this.color = "";
    this.points = [];
    this.lines = [];
    this.matrixX = undefined;
    this.matrixY = undefined;
};

function Player() {
    this.name = ""; //Por enquanto possui o id do socket
    this.color = "";
    this.score = 0;
    this.id = "";
};

function Point(crdX, crdY) {
    this.x = crdX;
    this.y = crdY;
    this.matrixX = 0;
    this.matrixY = 0;
};

function Line(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
    this.color = "";
    this.filled = false;
};