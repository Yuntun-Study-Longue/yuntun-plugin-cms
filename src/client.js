import App from './app/app';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';
import { Frontload } from "react-frontload";

hydrate(
  <BrowserRouter>
  <Frontload noServerRender={true}>
  <App />
  </Frontload>
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
