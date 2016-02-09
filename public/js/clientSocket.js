var socket = io();

socket.on("connect", function () {
    alert("Connectado!");
});

socket.on("test", function (msg) {
    alert(msg);
});