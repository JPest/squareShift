var socket = io("http://localhost:3000");

socket.on("connect", function () {
    alert("Connectado!");
});

socket.on("test", function (msg) {
    alert(msg);
});