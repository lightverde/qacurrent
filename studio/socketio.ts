import { Server } from 'socket.io';
import type { Socket } from 'socket.io-client';

export type SocketClient = Socket;
export type SocketServer = Server;

export default function injectSocketIO(io: SocketServer) {
	const ns = io.of((name, auth, next) => {
		next(null, true);
	});
	ns.use((socket, next) => {
		const { tool, secret } = socket.handshake.auth;
		if (tool) {
			if (!secret) return next(new Error('no secret provided'));
			if (secret !== (globalThis as any).socketSecret) return next(new Error('invalid secret'));
			socket.data.tool = tool;
		}
		next();
	});
	ns.on('connection', (socket) => {
		socket.onAny((event, ...args) => {
			ns.emit(event, ...args);
		});
	});
}
