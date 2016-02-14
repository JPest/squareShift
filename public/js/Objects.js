function Player(name, color) {
    this.name = name;
    this.color = color;
    this.score = 0;
};


function Point(crdX, crdY) {
    this.crdX = crdX;
    this.crdY = crdY;
};

function Line(point1, point2) {
    this.ponint1 = point1;
    this.ponint2 = point2;
};

function Square() {
    this.filled = false;
    this.color = "";
    this.points = []; // Pontos aqui
    this.lines = []; // Linhas aqui
};