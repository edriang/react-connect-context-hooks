import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import config from "./auth_config.json";
import history from "./utils/history";

import Auth0Provider from './auth-store';

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const initSelection = {
  actionSelectors: ['initializeHandler'],
};

const onInit = async ({ initializeHandler, onRedirectCallback, ...initOptions }) => {
  initializeHandler(initOptions, onRedirectCallback);  
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    onInit={[initSelection, onInit]}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
