import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './modules';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger/src';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const logger = createLogger();
const store = createStore(rootReducer, applyMiddleware(logger));
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
