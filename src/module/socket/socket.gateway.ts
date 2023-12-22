import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('connected');
        })
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() body: any) {
        console.log(body);
        this.server.emit('newMessage', {
            msg: "new message",
            content: body,
        })
    }
}