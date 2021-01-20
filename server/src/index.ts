import http from 'http';
import { server as WebSocketServer, connection } from 'websocket';

const server = http.createServer();
server.listen(1234);
console.log('listening on http://localhost:1234');
let CLIENTS: connection[] = [];

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on('request', function (request) {
  const connection = request.accept(undefined, request.origin);
  CLIENTS.push(connection);
  console.log(new Date() + ' Connection accepted.');
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      if (message.utf8Data) {
        const json_mes = JSON.parse(message.utf8Data);
        if (json_mes['command'] == 'start') {
          console.log('Starting');
          const ips = [...new Set(CLIENTS.map((cli) => cli.remoteAddress))]
            .map((ip) => ip.split(':')[3])
            .filter((ip) => ip);
          const payload = { command: 'start', ips };
          CLIENTS.forEach((client) => {
            client.send(JSON.stringify(payload));
          });
        }
        if (json_mes['command'] == 'stop') {
          console.log('Stopping');
          CLIENTS.forEach((client) => {
            client.send(`{"command": "stop"}`);
          });
        }
      }
    }
  });
  connection.on('close', function (reasonCode, description) {
    CLIENTS = CLIENTS.filter((con) => con != connection);
  });
});
