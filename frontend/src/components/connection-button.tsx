import { useState } from 'react';
import { Button } from 'semantic-ui-react';

interface ConnectionButtonProps {
  webSocket: WebSocket;
}

export const ConnectionButton = ({ webSocket }: ConnectionButtonProps) => {
  const [started, setStarted] = useState(false);
  return (
    <Button
      color={started ? 'red' : 'green'}
      onClick={() => {
        setStarted(!started);
        started
          ? webSocket.send('{"command": "stop"}')
          : webSocket.send('{"command": "start"}');
      }}
    >
      {started ? 'Stop' : 'Start'}
    </Button>
  );
};
