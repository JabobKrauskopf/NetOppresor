import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/Home';
import 'semantic-ui-css/semantic.min.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
