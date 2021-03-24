import App from './app/app';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from "react-redux";
import { Frontload } from "react-frontload";
import { ConnectedRouter } from "connected-react-router";

import createStore from "./store";
// Create a store and get back itself and its history object
const { store, history } = createStore();

hydrate(
  <Provider store={store}>
  <ConnectedRouter history={history}>
  <Frontload noServerRender={true}>
  <App />
  </Frontload>
  </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
