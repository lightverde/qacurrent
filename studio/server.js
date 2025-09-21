#!/usr/bin/env node
import http from 'http';
import express from 'express';
import { handler } from './handler.js';
import injectSocketIO from './socketio.js';

import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

globalThis.socketSecret = crypto.randomUUID();

const io = new Server(server, { path: '/socket.io' });
// Inject SocketIO
injectSocketIO(io);

// SvelteKit handlers
app.use(handler);

const port = process.env.PORT || '3000';
const host = process.env.HOST || '0.0.0.0';
server.listen(port, host, () => {
	console.log(`Running on \x1b[36mhttp://${host}:${port}\x1b[0m`);
});
