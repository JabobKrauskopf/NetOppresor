import React from 'react';
import { Button } from 'semantic-ui-react';
import './Home.css';

export const App: React.FC = () => {
  const webSocket = new WebSocket('ws://localhost:1234');
  return (
    <div className="divStyle">
      <div>
        <Button
          color="red"
          onClick={() => {
            webSocket.send('{"command": "start"}');
          }}
        >
          Start
        </Button>
        <Button
          color="red"
          onClick={() => {
            webSocket.send('{"command": "stop"}');
          }}
        >
          Stop
        </Button>
      </div>
    </div>
  );
};

export default App;
