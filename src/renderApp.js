import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { Provider } from "react-redux";
import { Frontload, frontloadServerRender } from "react-frontload";
// why Loadable? cause React.lazy and Suspense are not yet available for server-side rendering. 
import Loadable from "react-loadable";
import App from './app/app';
import createStore from "./store";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

export const renderApp = async (request, h) => {
    const { store } = createStore(request.url);

    const context  = {};
    const modules = [];

    const markup = await frontloadServerRender(() => 
        renderToString(
            <Loadable.Capture report={m => modules.push(m)}>
            <Provider store={store}>
            <StaticRouter context={context} location={request.url}>
            <Frontload isServer={true}>
            <App />
            </Frontload>
            </StaticRouter>
            </Provider>
            </Loadable.Capture>
        )
    )
    const html =
      // prettier-ignore
      `<!doctype html>
      <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Welcome to IDP</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${
          assets.client.css
              ? process.env.NODE_ENV === 'production'
                  ? assets.client.css.map( c => `<link rel="stylesheet" href="${c}">`).join("")
                  : `<link rel="stylesheet" href="${assets.client.css}">`
              : ''
          }
          ${
          process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
          <script type="text/javascript" src="/public/jsencrypt.min.js"></script>
          <script type="text/javascript" src="/public/jquery-1.8.3.min.js"></script>
          <script type="text/javascript">
            function Encrypt(json_str) {
                var cryptor = new JSEncrypt();
                cryptor.setPublicKey(document.getElementById('Auth-PubKey').value);
                return cryptor.encrypt(json_str);
            }
          </script>
      </head>
      <body>
          <div id="root">${markup}</div>
          <div id="extension-node"></div>
      </body>
    </html>`;
  
    return { html };
};