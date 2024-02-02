import { Socket } from 'socket.io';
import http from 'http';
const express = require('express');
const { Server } = require('socket.io');

const server = http.createServer(http);
const io = new Server();

io.on('connection', (socket: Socket) => {
  console.log('A User Connected');
});

server.listen(3000, () => {
  console.log('server running at http://localhost:5000');
});
