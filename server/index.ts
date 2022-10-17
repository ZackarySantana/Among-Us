import type { Socket } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = new http.Server(app);

const io = require("socket.io")(server, {
    cors: {
        origins: ["http://localhost:8080"],
    },
});

io.on("connection", (socket: Socket) => {
    const room = socket.handshake.query.room;

    socket.join(room ?? "");
    io.to(room).emit("playerJoined");

    console.log("player connected");

    socket.on("disconnect", () => {
        console.log("player disconnected");
    });

    socket.on("move", ({ x, y }: { x: number; y: number }) => {
        socket.broadcast.emit("move", { x, y });
    });
    socket.on("moveEnd", () => {
        socket.broadcast.emit("moveEnd");
    });
});

server.listen(3000, () => {
    console.log("server listening on localhost:3000");
});
