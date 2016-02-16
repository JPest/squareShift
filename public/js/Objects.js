function Player() {
    this.name = "";
    this.color = "";
    this.score = 0;
    this.id = "";
};


function Point(crdX, crdY) {
    this.x = crdX;
    this.y = crdY;
    this.matrixX = undefined;
    this.matrixY = undefined;
};

function Line(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
    this.color = "";
    this.filled = false;
};

function Square() {
    this.filled = false;
    this.color = "";
    this.points = []; // Pontos aqui
    this.lines = []; // Linhas aqui
};

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