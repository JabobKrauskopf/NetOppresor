import http from 'http';
import { server as WebSocketServer } from 'websocket';

const server = http.createServer();
server.listen(1234);
console.log('listening on http://localhost:1234');

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on('request', function (request) {
  const connection = request.accept('echo-protocol', request.origin);

  console.log(new Date() + ' Connection accepted.');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data || '');
    } else if (message.type === 'binary') {
      console.log(
        'Received Binary Message of ' + message.binaryData?.length + ' bytes',
      );
      connection.sendBytes(message.binaryData || new Buffer(''));
    }
  });
  connection.on('close', function (reasonCode, description) {
    console.log(
      new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.',
    );
  });
});
