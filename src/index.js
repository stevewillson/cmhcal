import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/integration/react'

import { store, persistor } from './configureStore'

import App from './assets/App';

import * as serviceWorker from '../../cmhcal/src/serviceWorker.js';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>, 
  document.getElementById('root')
);

serviceWorker.register();

