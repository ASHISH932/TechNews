import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './index.css';
// import App from '../App';
import {Provider} from 'react-redux'
import configureStore from '../redux/configureStore'
import App from '../components/App'

// Read the state sent with markup
const state = window.__STATE__;

const browserHistory = createBrowserHistory();
// delete the state from global window object
delete window.__STATE__;

// reproduce the store used to render the page on server
const store = configureStore(state);

ReactDOM.hydrate(
  <Provider store={store} >
    <Router history={browserHistory}>
      <Route
        render={matchProps => (
            <App {...matchProps} />
        )}
      />
    </Router>
  </Provider>,
  document.getElementById('root')
);
