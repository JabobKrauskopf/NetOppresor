import React from 'react';
import './Home.css';
import { ConnectionButton } from '../components/connection-button';

export const App: React.FC = () => {
  const webSocket = new WebSocket('ws://localhost:1234');
  return (
    <div className="divStyle">
      <div className="test">
        <ConnectionButton webSocket={webSocket} />
      </div>
    </div>
  );
};

export default App;
